import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
import { MovieEntity } from '../entities';

export class MovieSearchMap {
  public name: string;
  public year: number;
  public tags: string[];

  public searchTerms: string;
  public movieId: string;
}

export class MovieSearchIndex extends AbstractJavaScriptIndexCreationTask<
  MovieEntity,
    MovieSearchMap
> {
  constructor() {
    super();
    this.map(new MovieEntity().collectionName, (doc) => {
      const searchTerms =
        doc.name + ' ' +
        doc.year + ' ' +
        doc.tags.join(' ');

      return {
        movieId: doc['@metadata']['@id'],
        name: doc.name,
        year: doc.year,
        tags: doc.tags,
        searchTerms,
      };
    });

    this.index('searchTerms', 'Search');
    this.store('searchTerms', 'Yes');
  }
}
