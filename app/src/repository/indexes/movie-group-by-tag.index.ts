import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
import { MovieEntity } from '../entities';

export class MovieGroupByTagMap {
  public tag: string;
  public movies: MovieEntity[];
}

export class MovieGroupByTagIndex extends AbstractJavaScriptIndexCreationTask<
  MovieEntity,
  MovieGroupByTagMap
> {
  constructor() {
    super();

    this.map(new MovieEntity().collectionName, (doc) => {
      const tags = doc.tags || [];
      return tags.map(t => ({
        tag: t,
        movies: [doc],
        count: 1,
      }));
    });

    this.reduce((res) => {
      return res
        .groupBy((x) => x.tag)
        .aggregate((g) => ({
          tag: g.key,
          movies: g.values.reduce((movies, val) => [...movies, ...val.movies], []),
          count: g.values.length || 0,
        }));
    });
  }
}
