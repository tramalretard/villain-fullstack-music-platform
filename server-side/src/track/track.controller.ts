import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'prisma/generated';
import { CreateTrackDto } from './dto/create-track.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('get-by/:id')
  async getTrackById(@Param('id') trackId: string) {
    return this.trackService.getTrackByIdService(trackId);
  }

  @Auth(UserRole.ARTIST)
  @Post('add')
  @UseInterceptors(FileInterceptor('audio'))
  async createTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTrackDto,
    @CurrentUser('id') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не был предоставлен в поле "audio"');
    }

    return this.trackService.createTrackWithAudioFileService(dto, file, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch('update/:id')
  async updateTrack(
    @Param('id') trackId: string,
    @Body() dto: UpdateTrackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.updateTrackService(trackId, dto, userId);
  }

  @Auth(UserRole.ARTIST)
  @Delete('delete/:id')
  async deleteTrack(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.deleteTrackService(trackId, userId);
  }

  @Post('listen/:id')
  async incrementListenCount(@Param('id') trackId: string) {
    return this.trackService.incrementListenCountService(trackId);
  }

  @Auth()
  @Post('mark/:id')
  async markTrackAsFavorite(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.markTrackService(trackId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch('image/:id')
  @UseInterceptors(FileInterceptor('track-covers'))
  async updateImage(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Файл не был предоставлен в поле "track-covers"',
      );
    }

    return this.trackService.updateImageTrackService(trackId, userId, file);
  }

  @Auth(UserRole.ARTIST)
  @Post('publish/:id')
  async submitForPublication(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.submitForPublicationService(trackId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':trackId/to/:albumId')
  async assignTrackToAlbum(
    @Param('trackId') trackId: string,
    @Param('albumId') albumId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.assignTrackToAlbumService(
      trackId,
      albumId,
      userId,
    );
  }
}
