import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty({ message: 'Название трека не может быть пустым' })
  name: string;

  @IsString()
  imageSrc: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isExplicit?: boolean;

  @IsString()
  @IsOptional()
  albumId?: string;
}
