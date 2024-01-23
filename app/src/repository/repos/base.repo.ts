import { BaseEntity } from '../entities';
import DocumentStore, { ObjectTypeDescriptor } from 'ravendb';

export class PaginationContext {
  public page: number;
  public pageSize: number;
}

export class PaginatedResults<TPaginated extends BaseEntity> {
  public page: number;
  public pageSize: number;
  public pagesTotal: number;
  public docsTotal: number;
  public results: TPaginated[];
}

export class BaseRepo<TEntity extends BaseEntity> {
  protected metadataRemove(obj) {
    if (!obj) {
      return null;
    }

    const conv = obj;

    delete conv['__PROJECTED_NESTED_OBJECT_TYPES__'];
    delete conv['@metadata'];

    return conv;
  }

  protected get defaultPaginationContext(): PaginationContext {
    return {
      page: 1,
      pageSize: 50,
    };
  }

  protected get maxPageSize(): number {
    return 200;
  }

  constructor(
    protected readonly documentStore: DocumentStore,
    protected readonly descriptor: {
      class: ObjectTypeDescriptor<TEntity>;
      collection: string;
    },
  ) {}

  public async storeDocument(entity: TEntity): Promise<TEntity> {
    const session = this.documentStore.openSession();

    const id = entity.id;

    entity['@metadata'] = {
      ['@collection']: this.descriptor.collection,
    };

    await session.store(entity, id);
    await session.saveChanges();

    session.dispose();

    return this.metadataRemove(entity);
  }

  public async retrieveDocuments(): Promise<TEntity[]> {
    const session = this.documentStore.openSession();

    const results = await session
      .query({
        collection: this.descriptor.collection,
        documentType: this.descriptor.class,
      })
      .all();

    session.dispose();

    return results.map(this.metadataRemove);
  }

  public async retrieveDocumentsPaginated(pagination: PaginationContext = null): Promise<PaginatedResults<TEntity>> {
    pagination = pagination || this.defaultPaginationContext;

    if (!pagination.page) {
      pagination.page = this.defaultPaginationContext.page;
    }

    if (!pagination.pageSize) {
      pagination.pageSize = this.defaultPaginationContext.pageSize;
    }

    const session = this.documentStore.openSession();
    const query = () =>
      session.query({
        collection: this.descriptor.collection,
        documentType: this.descriptor.class,
      }).noTracking()

    // We do not allow for large page sizes
    if (pagination.pageSize > this.maxPageSize) {
      pagination.pageSize = this.maxPageSize;
    }

    const docsTotal = await query().count();
    const roundPages = Math.round(docsTotal / pagination.pageSize);
    const pagesTotal = roundPages >= 1 ? roundPages : 1;

    // Do some validation checks
    if (pagination.page <= 0) {
      pagination.page = 1;
    }

    if (pagination.page > pagesTotal) {
      pagination.page = pagesTotal;
    }

    const results = await query()
        .skip((pagination.page - 1) * pagination.pageSize)
        .take(pagination.pageSize)
        .all();

    session.dispose();

    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      pagesTotal,
      docsTotal,
      results: results.map(this.metadataRemove),
    }
  }

  public async documentExists(id: string): Promise<boolean> {
    const session = this.documentStore.openSession();

    const exists = await session
      .query({
        collection: this.descriptor.collection,
        documentType: this.descriptor.class,
      })
      .whereEquals('id', id)
      .any();

    session.dispose();

    return exists;
  }

  public async getById(id: string): Promise<TEntity> {
    const session = this.documentStore.openSession();

    const result = await session.load(id, {
      documentType: this.descriptor.class,
    });

    session.dispose();

    if (
      result &&
      result['@metadata']['@collection'] !== this.descriptor.collection
    ) {
      return null;
    }

    return this.metadataRemove(result);
  }

  public async deleteById(id: string): Promise<void> {
    const session = this.documentStore.openSession();

    await session.delete(id);

    await session.saveChanges();

    session.dispose();
  }

  public async addAttachment(documentId: string, attachmentName: string, data: Buffer): Promise<void> {
    if (!await this.documentExists(documentId)) {
      throw `Document with ID ${documentId} does not exist!`;
    }
    const session = this.documentStore.openSession();
    session.advanced.attachments.store(documentId, attachmentName, data);

    await session.saveChanges();
    session.dispose();
  }
}
