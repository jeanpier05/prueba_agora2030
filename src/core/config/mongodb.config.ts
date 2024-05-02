import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const mongodbConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`,
  // host: 'cluster0.an5ku3r.mongodb.net/',
  // port: 27017, // Ensure the correct MongoDB port is used
  // username: 'jeanpier164',
  // password: 'U8D4WD5imueJzUtB',
  // database: 'agora2030',
  entities: [__dirname + './../../**/*.entity{.ts,.js}'], // Define entities path
  useUnifiedTopology: true,
  useNewUrlParser: true,
  authSource: 'admin',
  logging: true,
};
