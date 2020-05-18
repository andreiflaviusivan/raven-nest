import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentStore } from "ravendb";

@Injectable()
export class RavendbService {
  private store: DocumentStore;

  constructor(configService: ConfigService) {
    this.store = new DocumentStore(
      configService.get<string>('RAVEN_SERVER'),
      configService.get<string>('RAVEN_DATABASE')
    );

    this.store.initialize();
  }

  async storeDocument(document: object): Promise<object> {
    const session = this.store.openSession();

    await session.store(document);
    await session.saveChanges();

    session.dispose();

    return document;
  }

  async listDocuments(): Promise<object> {
    const session = this.store.openSession();

    const objects = await session
      .query({

      })
      .noTracking()
      .all()
      ;

    session.dispose();

    return objects;
  }
}
