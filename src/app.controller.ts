import { Body, Controller, Post, Get, Version } from '@nestjs/common';
import { UseFilters } from '@nestjs/common/decorators';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './filters/exception.filter';

@Controller()
@UseFilters(HttpExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version('1')
  @Get()
  getHelloV1() {
    return 'Hello World V1!';
  }

  @Version('2')
  @Get()
  getHelloV2() {
    return 'Hello World V2!';
  }
  @Post('test')
  async create(@Body() dto: string) {
    throw new InternalServerErrorException();
  }
}
