import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException, Query, ParseIntPipe, DefaultValuePipe, BadRequestException,
} from '@nestjs/common';
import { PersistenceService, MovieRepo, MovieEntity } from './repository';

@Controller('movie')
export class MovieController {
  private readonly movieRepo: MovieRepo;

  constructor(readonly persistence: PersistenceService) {
    this.movieRepo = persistence.getMovieRepo();
  }

  @Get()
  async getMovies(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe) pageSize: number) {
    return await this.movieRepo.retrieveDocumentsPaginated({
      page, pageSize,
    });
  }

  @Get(':id')
  async getMovieById(@Param('id') id) {
    const movie = await this.movieRepo.getById(id);

    if (movie) {
      return movie;
    }

    throw new NotFoundException();
  }

  @Post()
  async createMovie(@Body() body: MovieEntity) {
    const created = await this.movieRepo.storeDocument(body);
    return created;
  }

  @Get('by/descriptions')
  async getMoviesWithDescriptions() {
    return await this.movieRepo.retrieveMoviesWithDescriptions();
  }

  @Get('by/yearCount')
  async getMoviesCountByYear() {
    return await this.movieRepo.retrieveMoviesCountByYear();
  }

  @Get('by/yearMovies')
  async getMoviesGroupByYear() {
    return await this.movieRepo.retrieveMoviesGroupByYear();
  }

  @Get('by/tagMovies')
  async getMoviesGroupByTag() {
    return await this.movieRepo.retrieveMoviesGroupByTag();
  }

  @Get('search/movies')
  async searchMovies(@Query('term') term: string) {
    if (term === null || term === '') {
      throw new BadRequestException();
    }
    return await this.movieRepo.searchMovies(term);
  }
}
