import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    return await this.studentRepository.save(createStudentDto);
  }

  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(id: string) {
    // return `This action returns a #${id} student`;
    // const _id = new ObjectId(id);
    const item = await this.studentRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!item) throw new NotFoundException('El registro no fue encontrado');

    return item;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // return `This action updates a #${id} student`;
    const _id = new ObjectId(id);
    await this.studentRepository.update({ _id: _id }, updateStudentDto);
  }

  async remove(id: string) {
    // return `This action removes a #${id} student`;
    const item = await this.findOne(id);
    await this.studentRepository.remove(item);
  }
}
