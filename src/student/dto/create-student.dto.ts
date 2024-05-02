import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the student' })
  @MinLength(4)
  @IsString()
  readonly name: string;
}
