import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PersistenceService, MovieRepo, MovieEntity } from './repository';

@Controller('movie')
export class MovieController {
  private readonly movieRepo: MovieRepo;

  constructor(readonly persistence: PersistenceService) {
    this.movieRepo = persistence.getMovieRepo();
  }

  @Get()
  async getMovies() {
    return await this.movieRepo.retrieveDocuments();
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
}
