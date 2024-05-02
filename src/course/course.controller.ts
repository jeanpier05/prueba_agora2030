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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
@ApiTags('Course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
