import { Module } from '@nestjs/common';
import { redisClientFactory } from 'src/core/config/redis.client.factory';
import { RedisRepository } from './repository/redis.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository],
  exports: [redisClientFactory, RedisRepository],
})
export class RedisModule {}
