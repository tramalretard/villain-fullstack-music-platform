import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { PrismaService } from 'src/prisma.service';
import { PlaylistModule } from 'src/playlist/playlist.module';
import { FileModule } from 'src/file/file.module';
import { PlaylistService } from 'src/playlist/playlist.service';

@Module({
  imports: [PlaylistModule, FileModule],
  controllers: [TrackController],
  providers: [TrackService, PrismaService, PlaylistService],
})
export class TrackModule {}
