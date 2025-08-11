import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PlaylistModule],
})
export class AppModule {}
