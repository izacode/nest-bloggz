
import { Controller, Delete, HttpCode,Get } from '@nestjs/common';
import { TestingClearService } from './testing-clear.service';

@Controller('testing')
export class TestingClearController {
  constructor(private testingService: TestingClearService) {}

  @Delete('/all-data')
  @HttpCode(204)
  async dropTestDatabase() {
    await this.testingService.dropTestBase();
    return;
  }
}
