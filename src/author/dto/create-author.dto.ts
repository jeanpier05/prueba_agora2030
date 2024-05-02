import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the author' })
  @MinLength(4)
  @IsString()
  readonly name: string;
}
