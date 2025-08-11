import { IsNotEmpty, IsString } from 'class-validator';

export class AddTrackDto {
  @IsString()
  @IsNotEmpty()
  trackId: string;
}
