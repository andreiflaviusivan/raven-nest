import { BaseRepo } from './base.repo';
import { MovieEntity } from '../entities';
import { MovieDescriptionIndex, MovieDescriptionMap } from '../indexes';

export class MovieRepo extends BaseRepo<MovieEntity> {
  public async retrieveMoviesWithDescriptions(): Promise<
    MovieDescriptionMap[]
  > {
    const session = this.documentStore.openSession();

    // FIXME This approach should work as well
    // const query = session
    //   .query({
    //     indexName: MovieDescriptionIndex.name,
    //     documentType: MovieDescriptionMap,
    //   })
    //   .selectFields(['description', 'name', 'year'], MovieDescriptionMap, 'FromIndex')

    const query = session.advanced
      .rawQuery<MovieDescriptionMap>(`from index '${MovieDescriptionIndex.name}'`)
      .projection('FromIndex');

    const results = await query.all();

    session.dispose();

    return results;
  }
}
