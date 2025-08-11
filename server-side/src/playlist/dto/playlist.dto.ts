import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlaylistDto {
  @IsString({ message: 'Название плейлиста должно быть строкой' })
  @IsNotEmpty({ message: 'Название плейлиста не может быть пустым' })
  name: string;

  @IsOptional()
  @IsString()
  imageSrc: string;
}
