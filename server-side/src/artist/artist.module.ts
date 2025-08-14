import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService, FileService],
})
export class ArtistModule {}
