import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string = '';

  @ApiProperty({ nullable: true })
  telegramId: string | null = null;

  @ApiProperty({ nullable: true })
  tonAddress: string | null = null;

  @ApiProperty({ nullable: true })
  evmAddress: string | null = null;

  @ApiProperty()
  gold: number = 0;

  @ApiProperty()
  finishOnboarding: boolean = false;

  @ApiProperty()
  createdBy: string | null = null;

  @ApiProperty()
  updatedBy: string | null = null;

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  updatedAt: Date = new Date();

  @ApiProperty({ nullable: true })
  deletedAt: Date | null = null;
}
