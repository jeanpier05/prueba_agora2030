import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './../redis/redis.module';
import { RedisRepository } from './../redis/repository/redis.repository';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), RedisModule],
  controllers: [BookController],
  providers: [BookService, RedisRepository],
})
export class BookModule {}
