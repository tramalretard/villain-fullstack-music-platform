import {
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

  @Get(':id')
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
    return this.trackService.createTrackWithAudioFileService(dto, file, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':id')
  async updateTrack(
    @Param('id') trackId: string,
    @Body() dto: UpdateTrackDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.updateTrackService(trackId, dto, userId);
  }

  @Auth(UserRole.ARTIST)
  @Delete(':id')
  async deleteTrack(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.deleteTrackService(trackId, userId);
  }

  @Post(':id/listen')
  async incrementListenCount(@Param('id') trackId: string) {
    return this.trackService.incrementListenCountService(trackId);
  }

  @Auth()
  @Post(':id/mark')
  async markTrackAsFavorite(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.markTrackService(trackId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.trackService.updateImageTrackService(trackId, userId, file);
  }

  @Auth(UserRole.ARTIST)
  @Post(':id/publish')
  async submitForPublication(
    @Param('id') trackId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.trackService.submitForPublicationService(trackId, userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch(':trackId/assign-to/:albumId')
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
