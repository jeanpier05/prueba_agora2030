import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryBookDto {
  @ApiProperty({
    example: 'title',
    description: 'title Book',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 10,
    description: 'Limit rows',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly size: number;

  @ApiProperty({
    example: 1,
    description: 'Number Page',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number;

  //   readonly take: number;
  //   readonly skip: number;
  @ApiProperty({
    example: 'ASC',
    description: 'Order',
  })
  @IsString()
  @IsEnum(Order)
  readonly order: string;
}
