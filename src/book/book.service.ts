import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateBookDto } from './dto/create-book.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
@Injectable()
export class BookService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async getBookTradeForm() {
    const result = await firstValueFrom(
      this.client.send<string, string>('book', 'Test').pipe(),
    );
    if (Object.prototype.hasOwnProperty.call(result, 'error')) {
      throw new InternalServerErrorException(
        'The server encountered an error and could not complete your request',
      );
    }
    return result;
  }

  async getBook() {
    const result = await firstValueFrom(
      this.client.send<string, string>('db/book/get', '').pipe(),
    );
    return result;
  }

  async getBookWithPagination(options: IPaginationOptions) {
    const result = await firstValueFrom(
      this.client
        .send<string, IPaginationOptions>('db/book/get/paginated', options)
        .pipe(),
    );
    return result;
  }

  getTodos(id: string) {
    return this.client.send<string, string>('book/todos', id).pipe();
  }

  postBook(createBookDto) {
    return this.client.send<string, CreateBookDto>('db/book', createBookDto);
  }

  uploadFile(file) {
    return this.client.send<string, any>('/book/upload', file);
  }
}
