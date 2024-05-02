import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Book Title',
    description: 'The title of the book',
  })
  @MinLength(4)
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: '123456789012345678901234',
    description: 'The ID of the author',
  })
  readonly authorId: string; // Assuming you use a string representation of the author's ObjectId
}
