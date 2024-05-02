import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository, Repository } from 'typeorm';
import { RedisPrefixEnum } from './../redis/enum/redis-prefix-enum';
import { RedisRepository } from './../redis/repository/redis.repository';
import { CreateAuthorDto } from './dto/create-author.dto';
import { PaginatedResult } from './dto/paginated-result.dto';
import { QueryAuthorDto } from './dto/query-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Author)
    private readonly _authorRepository: MongoRepository<Author>,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
    private configService: ConfigService,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.authorRepository.save(createAuthorDto);
    if (author) {
      const authors = await this.authorRepository.find();
      // Expiry is set to 1 day
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.AUTHOR_ALL,
        'LIST',
        JSON.stringify(authors),
        this.configService.get<number>('TTL'),
      );
      Logger.log(`[SET] Cache Redis - ${AuthorService.name}: create`);
    }
    return author;
  }

  async findAll() {
    const authors = await this.redisRepository.get(
      RedisPrefixEnum.AUTHOR_ALL,
      'LIST',
    );
    if (authors) {
      Logger.log(`[GET] Cache Redis - ${AuthorService.name}: findAll`);
      return authors;
    } else {
      const _authors = await this.authorRepository.find();

      // Expiry is set to 1 day
      await this.redisRepository.setWithExpiry(
        RedisPrefixEnum.AUTHOR_ALL,
        'LIST',
        JSON.stringify(_authors),
        this.configService.get<number>('TTL'),
      );
      Logger.log(`[SET] Cache Redis - ${AuthorService.name}: create`);

      return _authors;
    }
  }

  async findOne(id: string) {
    return await this.authorRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    // return `This action updates a #${id} author`;
    const _authors = await this.authorRepository.find();

    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.AUTHOR_ALL,
      'LIST',
      JSON.stringify(_authors),
      this.configService.get<number>('TTL'),
    );
    Logger.log(`[SET] Cache Redis - ${AuthorService.name}: update`);

    const _id = new ObjectId(id);
    await this.authorRepository.update(_id, updateAuthorDto);
  }

  async remove(id: string) {
    // return `This action removes a #${id} author`;
    const _authors = await this.authorRepository.find();

    // Expiry is set to 1 day
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.AUTHOR_ALL,
      'LIST',
      JSON.stringify(_authors),
      this.configService.get<number>('TTL'),
    );
    Logger.log(`[SET] Cache Redis - ${AuthorService.name}: remove`);

    const item = await this.findOne(id);
    await this.authorRepository.remove(item);
  }

  async findQuery(queryAuthorDto: QueryAuthorDto): Promise<PaginatedResult> {
    const take = queryAuthorDto.size || 10;
    const skip = queryAuthorDto.page ? (queryAuthorDto.page - 1) * take : 0;
    const _name = queryAuthorDto.name || '';

    // const [result, total] = await this.authorRepository.findAndCount({
    //   where: { name: Like('Jane%') },
    //   // where: `"name" LIKE 'Jane%'`,
    //   // where: {
    //   //   name: new RegExp(`^${_name}`),
    //   // },
    //   order: { name: queryAuthorDto.order === 'DESC' ? 'DESC' : 'ASC' },
    //   take: take,
    //   skip: skip,
    // });

    const [result, total] = await this._authorRepository.findAndCount({
      where: {
        name: { $regex: `.*${_name}.*`, $options: 'i' }, // $regex para la expresión regular, $options: 'i' para insensibilidad a mayúsculas/minúsculas
      },
      order: { name: queryAuthorDto.order === 'DESC' ? 'DESC' : 'ASC' },
      take: take,
      skip: skip,
    });

    return {
      data: result,
      meta: {
        total,
        page: queryAuthorDto.page,
        rows: take,
      },
    } as PaginatedResult;
  }
}
