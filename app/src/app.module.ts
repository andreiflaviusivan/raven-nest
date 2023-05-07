import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RavendbService } from './ravendb/ravendb.service';
import { AppConfigModule } from './app-config';
import { RepositoryModule } from './repository';
import { MovieController } from './movie.controller';

@Module({
  imports: [AppConfigModule, RepositoryModule],
  controllers: [AppController, MovieController],
  providers: [AppService, RavendbService],
})
export class AppModule {}
