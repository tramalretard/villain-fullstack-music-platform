import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma.service';
import { AlbumDto } from './dto/album.dto';
import { PrismaClientKnownRequestError } from 'prisma/generated/runtime/library';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async getAlbumByIdService(albumId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: {
        tracks: { orderBy: { name: 'asc' } },
        artist: { select: { id: true, displayName: true } },
      },
    });

    if (!album) {
      throw new NotFoundException('Альбом не найден');
    }
    return album;
  }

  async createAlbumService(dto: AlbumDto, userId: string) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { userId },
    });

    if (!artistProfile) {
      throw new ForbiddenException('Только артисты могут создавать альбомы');
    }

    try {
      return await this.prisma.album.create({
        data: {
          name: dto.name,
          isExplicit: dto.isExplicit ?? false,
          artistId: artistProfile.id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('У вас уже есть альбом с таким названием');
      }
      throw error;
    }
  }

  async deleteAlbumService(albumId: string, userId: string) {
    const [album, artistProfile] = await Promise.all([
      this.prisma.album.findUnique({ where: { id: albumId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!album || !artistProfile || album.artistId !== artistProfile.id) {
      throw new ForbiddenException('У вас нет прав на удаление этого альбома');
    }

    if (album.status === 'PUBLISHED') {
      throw new ForbiddenException('Нельзя удалить уже опубликованный альбом');
    }

    await this.prisma.album.delete({ where: { id: albumId } });
    return true;
  }

  async updateAlbumService(
    albumId: string,
    userId: string,
    dto: UpdateAlbumDto,
  ) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (album!.status === 'PUBLISHED') {
      throw new ForbiddenException(
        'Нельзя редактировать уже опубликованный альбом',
      );
    }

    return this.prisma.album.update({ where: { id: albumId }, data: dto });
  }

  async updateImageAlbumService(
    albumId: string,
    userId: string,
    imageFile: Express.Multer.File,
  ) {
    const [album, artistProfile] = await Promise.all([
      this.prisma.album.findUnique({ where: { id: albumId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!album) throw new NotFoundException('Альбом не найден');
    if (!artistProfile)
      throw new ForbiddenException('Профиль артиста не найден');

    if (album.status === 'PUBLISHED') {
      throw new ForbiddenException(
        'Нельзя редактировать обложку у уже опубликованного альбома',
      );
    }

    const { url } = await this.fileService.saveFile(imageFile, 'album-covers');

    return this.prisma.album.update({
      where: { id: albumId },
      data: { imageSrc: url },
    });
  }

  async markAlbumAsFavoriteService(albumId: string, userId: string) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      throw new NotFoundException('Альбом не найден');
    }

    const isFavorited = await this.prisma.album.findFirst({
      where: {
        id: albumId,
        favoritedBy: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (isFavorited) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          favoriteAlbums: {
            disconnect: { id: albumId },
          },
        },
      });
      return { message: 'Альбом удален' };
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          favoriteAlbums: {
            connect: { id: albumId },
          },
        },
      });
      return { message: 'Альбом добавлен' };
    }
  }

  async getMyFavoriteAlbumsService(userId: string) {
    const favoriteAlbums = await this.prisma.album.findMany({
      where: {
        favoritedBy: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        artist: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return favoriteAlbums;
  }

  async submitForPublicationService(albumId: string, userId: string) {
    const [album, artistProfile] = await Promise.all([
      this.prisma.album.findUnique({ where: { id: albumId } }),
      this.prisma.artistProfile.findUnique({ where: { userId } }),
    ]);

    if (!album || !artistProfile || album.artistId !== artistProfile.id) {
      throw new ForbiddenException(
        'У вас нет прав на управление этим альбомом',
      );
    }

    if (album.status !== 'DRAFT') {
      throw new BadRequestException(
        `Можно опубликовать только альбом в статусе DRAFT. Текущий статус: ${album.status}`,
      );
    }

    const tracksInAlbum = await this.prisma.track.count({ where: { albumId } });
    if (tracksInAlbum === 0) {
      throw new BadRequestException('Нельзя опубликовать пустой альбом');
    }

    return this.prisma.album.update({
      where: { id: albumId },
      data: { status: 'PENDING_REVIEW' },
    });
  }
}
