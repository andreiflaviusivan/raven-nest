import { AbstractJavaScriptIndexCreationTask } from 'ravendb';
import { MovieEntity } from '../entities';

export class MovieDescriptionMap {
  public name: string;
  public year: number;
  public tags: string[];

  public description: string;
}

export class MovieDescriptionIndex extends AbstractJavaScriptIndexCreationTask<
  MovieEntity,
  MovieDescriptionMap
> {
  constructor() {
    super();
    this.map(new MovieEntity().collectionName, (doc) => {
      const description =
        doc.name +
        ' from year ' +
        doc.year +
        ' classified as: ' +
        doc.tags.join(', ');

      return {
        movieId: doc['@metadata']['@id'],
        name: doc.name,
        year: doc.year,
        tags: doc.tags,
        description,
      };
    });

    this.index('name', 'Exact');
    this.store('name', 'Yes');
  }
}
