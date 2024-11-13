import { UnauthorizedException } from '@nestjs/common';

export function checkTokenExpiry(payload: any): void {
  const now = Date.now();
  const issuedTime = payload?.iss * 1000;
  const expiredTime = payload?.exp * 1000;
  const prev5min = now - 5 * 60 * 1000; // 5 minutes
  const next5Min = now + 5 * 60 * 1000; // 5 minutes
  if (expiredTime <= now || expiredTime >= next5Min || issuedTime <= prev5min) {
    throw new UnauthorizedException('Invalid token expiration');
  }
}

export function extractTokenFromHeader(
  headers: Record<string, string | string[] | undefined>,
): string | undefined {
  const [type, token] = headers.authorization?.toString().split(' ') ?? [];
  // console.log(`Extracted Token Type: ${type}, Token: ${token}`);
  return type === 'Bearer' ? token : undefined;
}
