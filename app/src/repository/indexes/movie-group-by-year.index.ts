import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
import { MovieEntity } from '../entities';

export class MovieGroupByYearMap {
  public year: number;
  public movies: MovieEntity[];
}

export class MovieGroupByYearIndex extends AbstractJavaScriptIndexCreationTask<
  MovieEntity,
  MovieGroupByYearMap
> {
  constructor() {
    super();

    this.map(new MovieEntity().collectionName, (doc) => {
      return {
        year: doc.year,
        movies: [doc],
      };
    });

    this.reduce((res) => {
      return res
        .groupBy((x) => x.year)
        .aggregate((g) => ({
          year: g.key,
          movies: g.values.reduce((movies, val) => [...movies, ...val.movies], []),
        }));
    });
  }
}
