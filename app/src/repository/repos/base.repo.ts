import { BaseEntity } from '../entities';
import DocumentStore, { ObjectTypeDescriptor } from 'ravendb';

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
}
