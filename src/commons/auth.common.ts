import { jwtConstants } from '@/constants/jwt.constants';
import { UnauthorizedException } from '@nestjs/common';
import ms from 'ms';

export function checkTokenExpiry(payload: any): void {
  const now = Date.now();
  const issuedTime = payload?.iss * 1000;
  const expiredTime = payload?.exp * 1000;
  const prev5min = now - ms(jwtConstants.accessTokenExpiration || '5m');
  const next5Min = now + ms(jwtConstants.accessTokenExpiration || '5m');
  if (expiredTime <= now || expiredTime >= next5Min || issuedTime <= prev5min) {
    throw new UnauthorizedException('Invalid token expiration');
  }
}

export function extractTokenFromHeader(
  headers: Record<string, string | string[] | undefined>,
): string | undefined {
  const [type, token] = headers.authorization?.toString().split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
