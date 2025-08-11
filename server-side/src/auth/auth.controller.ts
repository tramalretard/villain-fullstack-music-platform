import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);

    this.authService.addRefreshTokenToCookie(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.register(dto);

    this.authService.addRefreshTokenToCookie(res, refreshToken);

    return response;
  }

  @UsePipes(new ValidationPipe())
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies = <string>(
      req.cookies[this.authService.REFRESH_TOKEN_NAME]
    );

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromCookie(res);
      throw new UnauthorizedException('Токен просрочен или невадилен');
    }

    const { refreshToken, ...response } =
      await this.authService.getNewRefreshToken(refreshTokenFromCookies);

    this.authService.addRefreshTokenToCookie(res, refreshToken);

    return response;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromCookie(res);

    return true;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleOAuth(@Req() _req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuth(req);

    this.authService.addRefreshTokenToCookie(res, refreshToken);

    return res.redirect(
      `${process.env['CLIENT_URL']}?accessToken=${response.accessToken}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() _req) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } =
      await this.authService.validateOAuth(req);

    this.authService.addRefreshTokenToCookie(res, refreshToken);

    return res.redirect(
      `${process.env['CLIENT_URL']}?accessToken=${response.accessToken}`,
    );
  }
}
