import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlaylistDto } from './dto/playlist.dto';
import { PrismaClientKnownRequestError } from 'prisma/generated/runtime/library';

const MARKED_TRACKS_PLAYLIST_NAME = 'Отмеченные треки';

@Injectable()
export class PlaylistService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlaylistByIdService(id: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: {
        id,
      },
      include: {
        user: { select: { id: true, name: true } },
        tracks: {
          orderBy: {
            addedAt: 'desc',
          },
          include: {
            track: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new NotFoundException('Плейлист с таким ID не найден');
    }

    return playlist;
  }

  async getMyPlaylistsService(userId: string) {
    const playlists = await this.prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return playlists;
  }

  async createPlaylistService(dto: PlaylistDto, id: string) {
    const playlist = await this.prisma.playlist.create({
      data: {
        name: dto.name,
        imageSrc: dto.imageSrc,
        userId: id,
      },
    });

    return playlist;
  }

  async deletePlaylistService(id: string, currentUserId: string) {
    const playlist = await this.prisma.playlist.findUnique({
      where: {
        id,
      },
    });

    if (playlist?.userId !== currentUserId)
      throw new ForbiddenException(
        'У вас нет прав для удаления этого плейлиста',
      );

    await this.prisma.playlist.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async updatePlaylistService(
    playlistId: string,
    dto: PlaylistDto,
    currentUserId: string,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist)
      throw new NotFoundException('Плейлист для обновления не найден');

    if (playlist.userId !== currentUserId) {
      throw new ForbiddenException(
        'У вас нет прав на редактирование этого плейлиста',
      );
    }

    return this.prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        name: dto.name,
        imageSrc: dto.imageSrc,
      },
    });
  }

  async addTrackToMarkedPlaylistService(trackId: string, userId: string) {
    const trackExists = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!trackExists) throw new NotFoundException('Трек не найден');

    let markedPlaylist = await this.prisma.playlist.findFirst({
      where: {
        name: MARKED_TRACKS_PLAYLIST_NAME,
        userId: userId,
      },
    });

    if (!markedPlaylist) {
      markedPlaylist = await this.prisma.playlist.create({
        data: {
          name: MARKED_TRACKS_PLAYLIST_NAME,
          userId: userId,
          imageSrc: '/uploads/marked-playlist.png',
        },
      });
    }

    return this.prisma.playlist.update({
      where: {
        id: markedPlaylist.id,
      },
      data: {
        tracks: {
          create: {
            track: { connect: { id: trackId } },
          },
        },
      },
    });
  }

  async removeTrackFromMarkedPlaylistService(trackId: string, userId: string) {
    const markedPlaylist = await this.prisma.playlist.findFirst({
      where: {
        name: MARKED_TRACKS_PLAYLIST_NAME,
        userId: userId,
      },
    });

    if (!markedPlaylist) {
      throw new NotFoundException('Плейлист отмеченных треков не найден');
    }

    return this.removeTrackFromPlaylistService(
      markedPlaylist.id,
      trackId,
      userId,
    );
  }

  async addTrackToPlaylistService(
    playlistId: string,
    trackId: string,
    currentUserId: string,
  ) {
    const [playlist, trackExists] = await Promise.all([
      this.prisma.playlist.findUnique({ where: { id: playlistId } }),
      this.prisma.track.findUnique({ where: { id: trackId } }),
    ]);

    if (!playlist) throw new NotFoundException('Плейлист не найден');
    if (!trackExists) throw new NotFoundException('Трек не найден');

    if (playlist.userId !== currentUserId) {
      throw new ForbiddenException(
        'У вас нет прав на добавление треков в этот плейлист',
      );
    }

    try {
      return await this.prisma.playlist.update({
        where: { id: playlistId },
        data: {
          tracks: {
            create: {
              track: { connect: { id: trackId } },
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Этот трек уже добавлен в этот плейлист');
      }
      throw error;
    }
  }

  async removeTrackFromPlaylistService(
    playlistId: string,
    trackId: string,
    currentUserId: string,
  ) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) throw new NotFoundException('Плейлист не найден');

    if (playlist.userId !== currentUserId)
      throw new ForbiddenException(
        'У вас нет прав на редактирование этого плейлиста',
      );

    await this.prisma.tracksOnPlaylists.delete({
      where: {
        playlistId_trackId: {
          playlistId: playlistId,
          trackId: trackId,
        },
      },
    });

    return { message: 'Трек успешно удален' };
  }
}
