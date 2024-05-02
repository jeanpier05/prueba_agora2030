import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { RedisPrefixEnum } from 'src/redis/enum/redis-prefix-enum';
import { MongoRepository, Repository } from 'typeorm';
import { RedisRepository } from './../redis/repository/redis.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { PaginatedResult } from './dto/paginated-result.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
    @InjectRepository(Book)
    private readonly _bookRepository: MongoRepository<Book>,
    private configService: ConfigService,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = await this.bookRepository.save(createBookDto);
    if (book) {
      const books = await this.bookRepository.find();
      // Expiry is set to 1 day
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.BOOKS_ALL,
        'LIST',
        JSON.stringify(books),
        this.configService.get<number>('TTL'),
      );
      Logger.log(`[SET] Cache Redis - ${BookService.name}: create`);
    }
    return book;
  }

  async findAll() {
    const books = await this.redisRepository.get(
      RedisPrefixEnum.BOOKS_ALL,
      'LIST',
    );
    if (books) {
      Logger.log(`[GET] Cache Redis - ${BookService.name}: findAll`);
      return books;
    } else {
      const _books = await this.bookRepository.find();

      // Expiry is set to 1 day
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.BOOKS_ALL,
        'LIST',
        JSON.stringify(_books),
        this.configService.get<number>('TTL'),
      );
      Logger.log(`[SET] Cache Redis - ${BookService.name}: create`);

      return _books;
    }
  }

  async findOne(id: string) {
    // return `This action returns a #${id} book`;
    // const _id = new ObjectId(id);
    const item = await this.bookRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!item) throw new NotFoundException('El registro no fue encontrado');

    return item;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    // return `This action updates a #${id} book`;
    const _books = await this.bookRepository.find();

    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.BOOKS_ALL,
      'LIST',
      JSON.stringify(_books),
      this.configService.get<number>('TTL'),
    );
    Logger.log(`[SET] Cache Redis - ${BookService.name}: update`);

    const _id = new ObjectId(id);
    await this.bookRepository.update({ _id: _id }, updateBookDto);
  }

  async remove(id: string) {
    // return `This action removes a #${id} book`;
    const _books = await this.bookRepository.find();

    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.BOOKS_ALL,
      'LIST',
      JSON.stringify(_books),
      this.configService.get<number>('TTL'),
    );
    Logger.log(`[SET] Cache Redis - ${BookService.name}: remove`);

    const item = await this.findOne(id);
    await this.bookRepository.remove(item);
  }

  async findQuery(queryBookDto: QueryBookDto): Promise<PaginatedResult> {
    const take = queryBookDto.size || 10;
    const skip = queryBookDto.page ? (queryBookDto.page - 1) * take : 0;
    const _title = queryBookDto.title || '';

    const [result, total] = await this._bookRepository.findAndCount({
      where: {
        title: { $regex: `.*${_title}.*`, $options: 'i' }, // $regex para la expresión regular, $options: 'i' para insensibilidad a mayúsculas/minúsculas
      },
      order: { title: queryBookDto.order === 'DESC' ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });

    return {
      data: result,
      meta: {
        total,
        page: queryBookDto.page,
        rows: take,
      },
    } as PaginatedResult;
  }
}
