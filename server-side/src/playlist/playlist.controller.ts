import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PlaylistDto } from './dto/playlist.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { AddTrackDto } from './dto/add-track.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Auth()
  @Get('/by-id/:id')
  async getPlaylistById(@Param('id') id: string) {
    return this.playlistService.getPlaylistByIdService(id);
  }

  @Auth()
  @Get('my')
  async getMyPlaylists(@CurrentUser('id') userId: string) {
    return this.playlistService.getMyPlaylistsService(userId);
  }

  @Auth()
  @Post('create')
  async createPlaylist(
    @CurrentUser('id') id: string,
    @Body() dto: PlaylistDto,
  ) {
    return this.playlistService.createPlaylistService(dto, id);
  }

  @Auth()
  @Delete(':id')
  async deletePlaylist(
    @Param('id') id: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.playlistService.deletePlaylistService(id, currentUserId);
  }

  @Auth()
  @Patch(':id')
  async updatePlaylist(
    @Param('id') playlistId: string,
    @Body() dto: PlaylistDto,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.playlistService.updatePlaylistService(
      playlistId,
      dto,
      currentUserId,
    );
  }

  @Auth()
  @Post('add-track/marked')
  async addTrackToMarked(
    @CurrentUser('id') userId: string,
    @Body() dto: AddTrackDto,
  ) {
    return this.playlistService.addTrackToMarkedPlaylistService(
      dto.trackId,
      userId,
    );
  }

  @Auth()
  @Patch(':playlistId/add-track')
  async addTrackToPlaylist(
    @Param('playlistId') playlistId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: AddTrackDto,
  ) {
    return this.playlistService.addTrackToPlaylistService(
      playlistId,
      dto.trackId,
      userId,
    );
  }
}
