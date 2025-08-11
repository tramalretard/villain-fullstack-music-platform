import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');
    const serverURL = configService.get<string>('SERVER_URL');

    if (!clientID || !clientSecret || !serverURL) {
      throw new Error(
        'GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET или SERVER_URL не найдены',
      );
    }

    super({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: serverURL + '/api/auth/github/callback',
      scope: ['read:user', 'user:email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const { username, emails, photos } = profile;

    const email = emails && emails.length > 0 ? emails[0].value : null;

    if (!email) {
      throw new Error(
        'Не удалось получить почту Вашего аккаунта GitHub. Измените настройки приватности',
      );
    }

    const user = {
      email: email,
      name: username,
      picture: photos && photos.length > 0 ? photos[0].value : undefined,
    };

    return user;
  }
}
