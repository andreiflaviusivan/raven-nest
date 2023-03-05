import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import DocumentStore, { IAuthOptions } from 'ravendb';
import { entityDescriptor, MovieEntity } from '../entities';
import { MovieRepo } from '../repos';
import {MovieCountByYearIndex, MovieDescriptionIndex} from '../indexes';

@Injectable()
export class PersistenceService {
  private readonly documentStore: DocumentStore;
  private readonly descriptorsByCollection = {};
  private readonly descriptorsByName = {};
  private readonly documentInterfaces = {};
  private readonly logger = new Logger(PersistenceService.name);

  private async executeIndexes() {
    await this.documentStore.executeIndex(new MovieDescriptionIndex());
    await this.documentStore.executeIndex(new MovieCountByYearIndex());
  }

  constructor(private readonly config: ConfigService) {
    if (this.config.get('db.raven.secure')) {
      const authSettings: IAuthOptions = {
        certificate: fs.readFileSync(this.config.get('db.raven.certificate')),
        type: 'pfx',
        password: this.config.get('db.raven.passphrase'),
      };

      this.documentStore = new DocumentStore(
        this.config.get('db.raven.url'),
        this.config.get('db.raven.database'),
        authSettings,
      );
    } else {
      this.documentStore = new DocumentStore(
        this.config.get('db.raven.url'),
        this.config.get('db.raven.database'),
      );
    }

    entityDescriptor.forEach((descriptor) => {
      this.documentStore.conventions.registerEntityType(
        descriptor.class,
        descriptor.collection,
      );
      if (this.descriptorsByCollection[descriptor.collection]) {
        throw `Collection name ${descriptor.collection} already in use`;
      } else {
        this.descriptorsByCollection[descriptor.collection] = descriptor;
        this.descriptorsByName[descriptor.name] = descriptor;
      }
    });
    this.documentStore.initialize();

    this.executeIndexes().then(() =>
      this.logger.log('RavenDB index execution complete'),
    );
  }

  public getMovieRepo(): MovieRepo {
    if (!this.documentInterfaces[MovieEntity.name]) {
      this.documentInterfaces[MovieEntity.name] = new MovieRepo(
        this.documentStore,
        this.descriptorsByName[MovieEntity.name],
      );
    }
    return this.documentInterfaces[MovieEntity.name];
  }
}
