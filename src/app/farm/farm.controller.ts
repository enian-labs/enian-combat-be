import { Controller } from '@nestjs/common';
import { FarmService } from './farm.service';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}
}
