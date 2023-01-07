export abstract class BaseEntity {
  id: string;

  public abstract get collectionName(): string;
}
