import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PrismaService } from 'src/prisma.service';
import { FileService } from 'src/file/file.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService, FileService],
})
export class AlbumModule {}
