import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { RavendbService } from './ravendb/ravendb.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService, private readonly ravenService: RavendbService) {}

  @Get('hello')
  getHello(): object {
    return {
      salutation: this.appService.getHello(),
    };
  }

  @Get('entities')
  async getEntities(): Promise<object> {
    return await this.ravenService.listDocuments();
  }

  @Post('entities')
  async createEntity(@Body() body: object): Promise<object> {
    const created = await this.ravenService.storeDocument(body);

    return created;
  }
}
