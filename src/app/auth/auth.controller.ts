import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/decorators/response/response.decorator';
import { TransformInterceptor } from '@/interceptors/transform/transform.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login Endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login successfully',
  })
  @ResponseMessage('Login successfully')
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const user = await this.authService.login(body);

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    // Set refresh token as HttpOnly cookie
    req.res?.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    return { accessToken };
  }

  // Refresh Token Endpoint
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Refresh token successfully',
  })
  @ResponseMessage('Refresh token successfully')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    // Set the new refresh token as HttpOnly cookie
    req.res?.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
    });

    return { accessToken };
  }

  // Logout Endpoint
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Logged out successfully',
  })
  @ResponseMessage('Logged out successfully')
  async logout(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];

    await this.authService.revokeRefreshToken(refreshToken);

    // Clear the refresh token cookie
    req.res?.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }
}
