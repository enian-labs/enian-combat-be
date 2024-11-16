import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './app/user/user.module';
import { MissionController } from './app/mission/mission.controller';
import { MissionModule } from './app/mission/mission.module';
import { JwtModule } from '@nestjs/jwt';
import { OnboardingModule } from './app/onboarding/onboarding.module';
import { AuthModule } from './app/auth/auth.module';
import { FarmModule } from './app/farm/farm.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/api-docs',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '2h',
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
    SharedModule,
    UserModule,
    MissionModule,
    OnboardingModule,
    AuthModule,
    FarmModule,
  ],
  controllers: [AppController, MissionController],
  providers: [AppService],
})
export class AppModule {}
