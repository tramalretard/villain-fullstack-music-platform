import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @Length(3, 50)
  displayName?: string;

  @IsString()
  @IsOptional()
  @Length(10, 1000)
  bio?: string;
}
