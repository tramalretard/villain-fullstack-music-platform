import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'prisma/generated';
import { AlbumDto } from './dto/album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get('get-by/:id')
  async getById(@Param('id') albumId: string) {
    return this.albumService.getAlbumByIdService(albumId);
  }

  @Auth(UserRole.ARTIST)
  @Post('create')
  async createAlbum(@Body() dto: AlbumDto, @CurrentUser('id') userId: string) {
    return this.albumService.createAlbumService(dto, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch('update/:id')
  async updateAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbumService(albumId, userId, dto);
  }

  @Auth(UserRole.ARTIST)
  @Delete('delete/:id')
  async deleteAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.albumService.deleteAlbumService(albumId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch('image/:id')
  @UseInterceptors(FileInterceptor('album-covers'))
  async updateImageAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Файл не был предоставлен в поле "album-covers"',
      );
    }

    return this.albumService.updateImageAlbumService(albumId, userId, file);
  }

  @Auth(UserRole.ARTIST)
  @Post('publish/:id')
  async submitForPublication(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.albumService.submitForPublicationService(albumId, userId);
  }
}
