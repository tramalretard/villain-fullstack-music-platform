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

  @Get(':id')
  async getById(@Param('id') albumId: string) {
    return this.albumService.getAlbumByIdService(albumId);
  }

  @Auth(UserRole.ARTIST)
  @Post('create')
  async createAlbum(@Body() dto: AlbumDto, @CurrentUser('id') userId: string) {
    return this.albumService.createAlbumService(dto, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':id')
  async updateAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAlbumDto,
  ) {
    return this.albumService.updateAlbumService(albumId, userId, dto);
  }

  @Auth(UserRole.ARTIST)
  @Delete(':id')
  async deleteAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.albumService.deleteAlbumService(albumId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImageAlbum(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.albumService.updateImageAlbumService(albumId, userId, file);
  }

  @Auth(UserRole.ARTIST)
  @Post(':id/publish')
  async submitForPublication(
    @Param('id') albumId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.albumService.submitForPublication(albumId, userId);
  }
}
