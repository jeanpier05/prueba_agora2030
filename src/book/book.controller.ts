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
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBookDto } from './dto/query-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  @Post('findquery')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findQuery(@Body() queryBookDto: QueryBookDto) {
    return this.bookService.findQuery(queryBookDto);
  }
}
