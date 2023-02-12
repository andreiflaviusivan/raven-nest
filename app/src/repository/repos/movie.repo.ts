import { BaseRepo } from './base.repo';
import { MovieEntity } from '../entities';
import { MovieDescriptionIndex, MovieDescriptionMap } from '../indexes';

export class MovieRepo extends BaseRepo<MovieEntity> {
  public async retrieveMoviesWithDescriptions(): Promise<
    MovieDescriptionMap[]
  > {
    const session = this.documentStore.openSession();
    const query = session
      .query({
        indexName: MovieDescriptionIndex.name,
        documentType: MovieDescriptionMap,
      })
        .selectFields(['description', 'name', 'year'], MovieDescriptionMap, 'FromIndex')
      // .getIndexQuery();

    // const query = session.advanced
    //   // .rawQuery<MovieDescriptionMap>(indexQuery.query)
    //     .rawQuery<MovieDescriptionMap>('from index \'MovieDescriptionIndex\'')
    //     // .noCaching()
    //
    //   .projection('FromIndex');

    const results = await query.all();

    session.dispose();

    return results;
  }
}
