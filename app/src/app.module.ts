import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RavendbService } from './ravendb/ravendb.service';
import {AppConfigModule} from "./app-config";

@Module({
  imports: [
    AppConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, RavendbService],
})
export class AppModule {}
