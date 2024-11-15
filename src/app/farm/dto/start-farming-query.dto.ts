import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class StartFarmingQueryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  itemId!: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  isFastUpgrade!: boolean;
}
