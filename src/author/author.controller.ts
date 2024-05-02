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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }

  @Post('findquery')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('Api-Key')
  findQuery(@Body() queryAuthorDto: QueryAuthorDto) {
    return this.authorService.findQuery(queryAuthorDto);
  }
}
