import { FactoryProvider } from '@nestjs/common';
import { Redis } from 'ioredis';

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    // const redisInstance = new Redis({
    //   host: process.env.REDIS_HOST,
    //   port: +process.env.REDIS_PORT,
    // });
    // const redisInstance = new Redis(
    //   'redis://default:PK3HRkCc43DZLCJYSJVwqufv1y9wo28z@redis-15716.c16.us-east-1-3.ec2.redns.redis-cloud.com:15716/4?allowUsernameInURI=true',
    // );

    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME, // needs Redis >= 6
      password: process.env.REDIS_PASSWORD,
      db: 0, // Defaults to 0
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};
