import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostORMEntity } from 'src/post/entity/post.entity';
import { UserORMEntity } from 'src/user/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostORMEntity, UserORMEntity])],

  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
