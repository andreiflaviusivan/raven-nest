import { BaseEntity } from './base.entity';

export class ShopEntity extends BaseEntity {
  get collectionName(): string {
    return 'Shops';
  }

  public name: string;
  public type: string;
  public location: {
    latitude: number,
    longitude: number,
  }
}
