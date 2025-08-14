import { PartialType } from '@nestjs/mapped-types';
import { AlbumDto } from './album.dto';

export class UpdateAlbumDto extends PartialType(AlbumDto) {}
