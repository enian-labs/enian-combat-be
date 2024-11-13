import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  ParseEnumPipe,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { GetUser } from '@/decorators/get-user/get-user.decorator';
import { JwtAuthGuard } from '@/guards/auth.guard';
import { TransformInterceptor } from '@/interceptors/transform/transform.interceptor';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Return user profile',
    type: UserResponseDto,
  })
  async getProfile(@GetUser() user: User): Promise<UserResponseDto> {
    return this.userService.getUserProfile(user.id);
  }

  @Put('wallet')
  @ApiOperation({ summary: 'Update user wallet information' })
  @ApiBody({ type: UpdateWalletDto })
  @ApiResponse({
    status: 200,
    description: 'Wallet information updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Wallet address already in use' })
  async updateWallet(
    @GetUser() user: User,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUserWallets(user.id, updateWalletDto);
  }
}
