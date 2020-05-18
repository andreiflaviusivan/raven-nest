import { Test, TestingModule } from '@nestjs/testing';
import { RavendbService } from './ravendb.service';

describe('RavendbService', () => {
  let service: RavendbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RavendbService],
    }).compile();

    service = module.get<RavendbService>(RavendbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
