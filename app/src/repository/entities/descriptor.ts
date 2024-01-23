import { MovieEntity } from './movie.entity';
import { ShopEntity } from "./shop.entity";

export const entityDescriptor = [
  {
    class: MovieEntity,
    collection: new MovieEntity().collectionName,
    name: MovieEntity.name,
  },
  {
    class: ShopEntity,
    collection: new ShopEntity().collectionName,
    name: ShopEntity.name,
  },
];
