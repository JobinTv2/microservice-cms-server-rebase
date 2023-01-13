import { Body, Controller, Post } from '@nestjs/common';
import { UseFilters } from '@nestjs/common/decorators';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/exception.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('test')
  async create(@Body() dto: string) {
    throw new InternalServerErrorException();
  }
}
