import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { mongodbConfig } from './core/config/mongodb.config';
import { CourseModule } from './course/course.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    // Make the .env properties available throughout the application.
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(mongodbConfig),
    AuthorModule,
    BookModule,
    StudentModule,
    CourseModule,
    HealthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
