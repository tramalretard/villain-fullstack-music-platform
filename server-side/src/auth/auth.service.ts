import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'prisma/generated';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  REFRESH_TOKEN_EXPIRY_IN_DAYS = 14;
  ACCESS_TOKEN_EXPIRY_IN_MINUTES = '30m';
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  issueTokens(userId: string, userRole: UserRole): Tokens {
    const data = { id: userId, role: userRole };

    const accessToken = this.jwt.sign(data, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY_IN_MINUTES,
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: `${this.REFRESH_TOKEN_EXPIRY_IN_DAYS}d`,
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getUserByEmailService(dto.email);

    if (!user) throw new NotFoundException('Пользователь не существует');

    if (!user.password) {
      throw new BadRequestException(
        'Учетная запись не имеет пароля. Войдите с помощью Google или Github',
      );
    }

    const validPassword = await verify(user.password, dto.password);

    if (!validPassword) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return user;
  }

  async validateOAuth(req: {
    user: {
      email: string;
      name?: string;
      picture?: string;
    };
  }) {
    let user = await this.userService.getUserByEmailService(req.user.email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.picture,
        },
        include: {
          playlists: true,
          favoriteTracks: true,
          favoriteAlbums: true,
        },
      });
    }

    const tokens = this.issueTokens(user.id, user.role);

    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const userIsExist = await this.userService.getUserByEmailService(dto.email);

    if (userIsExist)
      throw new BadRequestException(
        'Пользователь с такой почтой уже зарегистрирован',
      );

    const user = await this.userService.createUserService(dto);

    const tokens = this.issueTokens(user.id, user.role);

    return { user, ...tokens };
  }

  async getNewRefreshToken(refreshToken: string) {
    let payload: { id: string };

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Невалидный или просроченный токен');
    }

    const user = await this.userService.getUserByIdService(payload.id);

    if (!user) {
      throw new BadRequestException(
        'При попытке выдачи нового токена, возникла ошибка - пользователь не существует',
      );
    }

    const tokens = this.issueTokens(user.id, user.role);

    return { user, ...tokens };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = this.issueTokens(user.id, user.role);

    return { user, ...tokens };
  }

  addRefreshTokenToCookie(res: Response, refreshToken: string) {
    const tokenExpiresIn = new Date();

    tokenExpiresIn.setDate(
      tokenExpiresIn.getDate() + this.REFRESH_TOKEN_EXPIRY_IN_DAYS,
    );

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      path: '/',
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: tokenExpiresIn,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
    });
  }

  removeRefreshTokenFromCookie(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      path: '/',
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? 'none'
          : 'lax',
    });
  }
}
