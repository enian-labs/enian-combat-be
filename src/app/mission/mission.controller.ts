import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MissionService } from './mission.service';
import { ListMissionQueryDto } from './dto/list-mission-query.dto';
import { User } from '@prisma/client';
import { PaginatedMissionResponseDto } from './dto/paginated-mission-response.dto';
import { CompleteMissionBodyDto } from './dto/complete-mission-query.dto';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { GetUser } from '@/decorators/get-user/get-user.decorator';

@ApiTags('Mission')
@Controller('missions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  @ApiOperation({ summary: 'Get missions list' })
  @ApiResponse({
    status: 200,
    description: 'Missions retrieved successfully',
    type: PaginatedMissionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Unable to retrieve missions list' })
  async missions(
    @GetUser() user: User,
    @Query() query: ListMissionQueryDto,
  ): Promise<PaginatedMissionResponseDto> {
    return await this.missionService.list(user.id, query);
  }

  @Post('/complete')
  @ApiOperation({ summary: 'Complete the mission' })
  @ApiResponse({
    status: 200,
    description: 'Mission completed successfully',
  })
  @ApiResponse({ status: 400, description: 'Mission incomplete' })
  async complete(
    @GetUser() user: User,
    @Body() body: CompleteMissionBodyDto,
  ): Promise<void> {
    return await this.missionService.complete(user.id, body.missionId);
  }
}
