import { ConfigService } from '@/shared/config/config.service';
import crypto from 'crypto';

const configService = new ConfigService();

export const verifyTelegramWebAppData = (telegramInitData: string) => {
  const initData = new URLSearchParams(telegramInitData);
  const hash = initData.get('hash');
  initData.delete('hash');

  // Seřadíme klíče a vytvoříme data-check-string
  const dataToCheck = [...initData.entries()]
    .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
    .sort()
    .join('\n');

  // Vytvoříme HMAC-SHA-256 podpis pro bot token s konstantou "WebAppData"
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(configService.telegram.botToken)
    .digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataToCheck)
    .digest('hex');

  return computedHash === hash;
};
