import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    return await this.courseRepository.save(createCourseDto);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: string) {
    // return `This action returns a #${id} course`;
    const _id = new ObjectId(id);
    const item = await this.courseRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!item) throw new NotFoundException('El registro no fue encontrado');

    return item;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // return `This action updates a #${id} course`;
    const _id = new ObjectId(id);
    await this.courseRepository.update({ _id: _id }, updateCourseDto);
  }

  async remove(id: string) {
    // return `This action removes a #${id} course`;
    const item = await this.findOne(id);
    await this.courseRepository.remove(item);
  }
}
