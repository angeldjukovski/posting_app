import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDTO } from './dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchQuery: SearchDTO) {
    return this.searchService.searchData(searchQuery);
  }
}
