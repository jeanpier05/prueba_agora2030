import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Course Name',
    description: 'The name of the course',
  })
  @MinLength(4)
  @IsString()
  readonly name: string;
}
