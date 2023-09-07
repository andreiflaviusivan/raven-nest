import { BaseRepo } from './base.repo';
import { MovieEntity } from '../entities';
import {
  MovieCountByYearIndex,
  MovieCountByYearMap,
  MovieDescriptionIndex,
  MovieDescriptionMap,
  MovieGroupByTagIndex,
  MovieGroupByTagMap,
  MovieGroupByYearIndex,
  MovieGroupByYearMap, MovieSearchIndex,
  MovieSearchMap,
} from '../indexes';
import {SuggestionsResponseObject} from "ravendb/dist/Types";

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
      .rawQuery<MovieDescriptionMap>(
        `from index '${MovieDescriptionIndex.name}'`,
      )
      .projection('FromIndex');

    const results = await query.all();

    session.dispose();

    return results;
  }

  public async retrieveMoviesCountByYear(): Promise<MovieCountByYearMap[]> {
    const session = this.documentStore.openSession();

    const query = session.advanced
      .rawQuery<MovieCountByYearMap>(
        `from index '${MovieCountByYearIndex.name}'`,
      )
      .projection('FromIndex');

    const results = await query.all();

    session.dispose();

    // To remove @metadata which is unnecessary
    return results.map(this.metadataRemove);
  }

  public async retrieveMoviesGroupByYear(): Promise<MovieGroupByYearMap[]> {
    const session = this.documentStore.openSession();

    const query = session.advanced
      .rawQuery<MovieGroupByYearMap>(
        `from index '${MovieGroupByYearIndex.name}'`,
      )
      .projection('FromIndex');

    const results = await query.all();

    results.forEach(r => r.movies.forEach(this.metadataRemove));

    session.dispose();

    // To remove @metadata which is unnecessary
    return results.map(this.metadataRemove);
  }

  public async retrieveMoviesGroupByTag(): Promise<MovieGroupByTagMap[]> {
    const session = this.documentStore.openSession();

    const query = session.advanced
        .rawQuery<MovieGroupByTagMap>(
            `from index '${MovieGroupByTagIndex.name}'`,
        )
        .projection('FromIndex');

    const results = await query.all();

    results.forEach(r => r.movies.forEach(this.metadataRemove));

    session.dispose();

    // To remove @metadata which is unnecessary
    return results.map(this.metadataRemove);
  }

  public async searchMovies(term: string): Promise<MovieEntity[]> {
    const session = this.documentStore.openSession();

    const query = session.query({
        indexName: MovieSearchIndex.name,
        documentType: MovieSearchMap,
      })
      .search('searchTerms', `*${term}*`)

    const results = await query.all();

    session.dispose();

    // To remove @metadata which is unnecessary
    return results.map(this.metadataRemove);
  }

  public async suggestTerms(term: string): Promise<SuggestionsResponseObject> {
    const session = this.documentStore.openSession();

    const query = session.query({
      indexName: MovieSearchIndex.name,
    })
    .suggestUsing(b => b.byField('searchTerms', term))

    const results = await query.execute()

    session.dispose();

    return results;
  }
}
