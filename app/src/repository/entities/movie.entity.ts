import { BaseEntity } from './base.entity';

export class MovieEntity extends BaseEntity {
  get collectionName(): string {
    return 'Movies';
  }

  public name: string;
  public year: number;
  public tags: string[];
}
