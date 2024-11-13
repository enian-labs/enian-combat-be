import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '@/decorators/get-user/get-user.decorator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { TransformInterceptor } from '@/interceptors/transform/transform.interceptor';

@ApiTags('Onboarding')
@Controller('onboarding')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get()
  @ApiOperation({ summary: 'Get onboarding status' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding status retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Unable to retrieve onboarding status',
  })
  async get(@GetUser() user: User): Promise<boolean> {
    return await this.onboardingService.get(user);
  }
}
