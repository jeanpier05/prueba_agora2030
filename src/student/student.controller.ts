import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from './../auth/guards/apikey.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('student')
@ApiTags('Student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
