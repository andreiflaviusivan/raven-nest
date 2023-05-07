import { MovieEntity } from './movie.entity';

export const entityDescriptor = [
  {
    class: MovieEntity,
    collection: new MovieEntity().collectionName,
    name: MovieEntity.name,
  },
];
