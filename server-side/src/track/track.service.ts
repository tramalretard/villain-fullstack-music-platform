import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PlaylistService } from 'src/playlist/playlist.service';
import { FileService } from 'src/file/file.service';
import * as mm from 'music-metadata';
import { PrismaClientKnownRequestError } from 'prisma/generated/runtime/library';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly playlistService: PlaylistService,
    private readonly fileService: FileService,
  ) {}

  async getTrackByIdService(trackId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        artist: { include: { user: { select: { id: true, name: true } } } },
        album: true,
      },
    });

    if (!track) {
      throw new NotFoundException('Трек не найден');
    }

    return track;
  }

  async createTrackWithAudioFileService(
    dto: CreateTrackDto,
    audioFile: Express.Multer.File,
    userId: string,
  ) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { userId },
    });

    if (!artistProfile) {
      throw new ForbiddenException('Загружать треки могут только исполнители');
    }

    const metadata = await mm.parseBuffer(audioFile.buffer, audioFile.mimetype);
    const duration = Math.round(metadata.format.duration ?? 0);

    const { url: audioUrl } = await this.fileService.saveFile(
      audioFile,
      `tracks/${artistProfile.id}`,
    );

    try {
      const track = await this.prisma.track.create({
        data: {
          name: dto.name,
          duration: duration,
          audioSrc: audioUrl,
          artistId: artistProfile.id,
          isExplicit: dto.isExplicit,
          albumId: dto.albumId,
        },
      });
      return track;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'У этого артиста уже есть трек с таким названием',
        );
      }
      throw error;
    }
  }

  async updateTrackService(
    trackId: string,
    dto: UpdateTrackDto,
    userId: string,
  ) {
    const [track, artistProfile] = await Promise.all([
      this.getTrackByIdService(trackId),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!artistProfile || track.artistId !== artistProfile.id)
      throw new ForbiddenException(
        'У вас нет прав на редактирование этого трека',
      );

    if (track.status === 'PUBLISHED') {
      throw new ForbiddenException(
        'Нельзя редактировать уже опубликованный трек',
      );
    }

    return this.prisma.track.update({
      where: { id: trackId },
      data: dto,
    });
  }

  async deleteTrackService(trackId: string, userId: string) {
    const [track, artistProfile] = await Promise.all([
      this.getTrackByIdService(trackId),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!artistProfile || track.artistId !== artistProfile.id)
      throw new ForbiddenException('У вас нет прав на удаление этого трека');

    if (track.status === 'PUBLISHED') {
      throw new ForbiddenException('Нельзя удалить уже опубликованный трек');
    }

    await this.prisma.track.delete({ where: { id: trackId } });
    return true;
  }

  async incrementListenCountService(trackId: string) {
    return this.prisma.track.update({
      where: { id: trackId },
      data: {
        listener: {
          increment: 1,
        },
      },
    });
  }

  async markTrackService(trackId: string, userId: string) {
    await this.playlistService.addTrackToMarkedPlaylistService(trackId, userId);
    return { message: 'Трек добавлен' };
  }

  async updateImageTrackService(
    trackId: string,
    userId: string,
    imageFile: Express.Multer.File,
  ) {
    const [track, artistProfile] = await Promise.all([
      this.prisma.track.findUnique({ where: { id: trackId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!track) throw new NotFoundException('Трек не найден');

    if (!artistProfile)
      throw new ForbiddenException('Профиль артиста не найден');

    if (track.status === 'PUBLISHED') {
      throw new ForbiddenException(
        'Нельзя редактировать обложку у уже опубликованного трек',
      );
    }

    const { url } = await this.fileService.saveFile(imageFile, 'track-covers');

    return this.prisma.track.update({
      where: { id: trackId },
      data: { imageSrc: url },
    });
  }

  async submitForPublicationService(trackId: string, userId: string) {
    const [track, artistProfile] = await Promise.all([
      this.prisma.track.findUnique({ where: { id: trackId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!track || !artistProfile || track.artistId !== artistProfile.id) {
      throw new ForbiddenException(
        'У вас нет прав на управление этим треком, либо вы трек не найден',
      );
    }

    if (track.status !== 'DRAFT') {
      throw new BadRequestException(
        `Можно опубликовать только трек в статусе DRAFT. Текущий статус: ${track.status}`,
      );
    }

    return this.prisma.track.update({
      where: { id: trackId },
      data: { status: 'PENDING_REVIEW' },
    });
  }

  async assignTrackToAlbumService(
    trackId: string,
    albumId: string,
    userId: string,
  ) {
    const [track, album, artistProfile] = await Promise.all([
      this.prisma.track.findUnique({ where: { id: trackId } }),
      this.prisma.album.findUnique({ where: { id: albumId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!track) throw new NotFoundException('Трек не найден');
    if (!album) throw new NotFoundException('Альбом не найден');
    if (!artistProfile)
      throw new ForbiddenException('Профиль артиста не найден');

    if (
      track.artistId !== artistProfile.id ||
      album.artistId !== artistProfile.id
    ) {
      throw new ForbiddenException(
        'У вас нет прав для выполнения этого действия',
      );
    }

    if (track.status === 'PUBLISHED' || album.status === 'PUBLISHED') {
      throw new ConflictException(
        'Нельзя добавлять треки в уже опубликованный альбом, или привязывать уже опубликованный сингл',
      );
    }

    if (track.albumId) {
      throw new ConflictException(
        `Этот трек уже является частью альбома с ID: ${track.albumId}`,
      );
    }

    return this.prisma.track.update({
      where: { id: trackId },
      data: {
        albumId: albumId,
      },
    });
  }
}
