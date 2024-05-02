import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './../redis/redis.module';
import { RedisRepository } from './../redis/repository/redis.repository';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), RedisModule],
  controllers: [AuthorController],
  providers: [AuthorService, RedisRepository],
})
export class AuthorModule {}
