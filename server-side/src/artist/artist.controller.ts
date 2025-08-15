import {
  BadRequestException,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Auth } from 'src/decorators/auth.decorator';
import { UserRole } from 'prisma/generated';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get('get-by/:id')
  async getPublicProfile(@Param('id') artistId: string) {
    return this.artistService.getPublicProfileService(artistId);
  }

  @Auth()
  @Post('become')
  async becomeArtist(@CurrentUser('id') userId: string) {
    return this.artistService.becomeArtistService(userId);
  }

  @Auth(UserRole.ARTIST)
  @Patch('/update')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateArtistDto,
  ) {
    return this.artistService.updateProfileService(userId, dto);
  }

  @Auth(UserRole.ARTIST)
  @Patch('image')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Файл не был предоставлен');
    return this.artistService.updateProfileImageService(userId, file);
  }
}
