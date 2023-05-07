import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
import { MovieEntity } from '../entities';

export class MovieCountByYearMap {
  public year: number;
  public count: number;
}

export class MovieCountByYearIndex extends AbstractJavaScriptIndexCreationTask<
  MovieEntity,
  MovieCountByYearMap
> {
  constructor() {
    super();

    this.map(new MovieEntity().collectionName, (doc) => {
      return {
        year: doc.year,
        count: 1,
      };
    });

    this.reduce((res) => {
      return res
        .groupBy((x) => x.year)
        .aggregate((g) => ({
          year: g.key,
          count: g.values.reduce((count, val) => val.count + count, 0),
        }));
    });
  }
}
