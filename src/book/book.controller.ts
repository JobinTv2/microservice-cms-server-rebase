import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseFilters,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Observable } from 'rxjs';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from 'src/auth/auth-guard/jwt-auth-guard';
import { HttpExceptionFilter } from 'src/filters/exception.filter';
import { diskStorage } from 'multer';
import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { Queue } from 'bull';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
@Controller('book')
@UseFilters(HttpExceptionFilter)
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @InjectQueue('file-upload-queue') private fileQueue: Queue,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/form')
  getBookTradeForm() {
    return this.bookService.getBookTradeForm();
  }

  // @Get('/todos/:id')
  // getTodos(@Req() req): Observable<string> {
  //   const { id } = req.params;
  //   return this.bookService.getTodos(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getBook() {
  //   return this.bookService.getBook();
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  getBook(@Query('page') page = 1, @Query('limit') limit = 2) {
    limit = limit > 100 ? 100 : limit;
    return this.bookService.getBook({
      limit,
      page,
      route: 'http://localhost:3000/book',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() createBookDto: CreateBookDto): Observable<string> {
    return this.bookService.postBook(createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    this.fileQueue.add('csvfilejob', { file: file }, { delay: 2000 });
    return { uploaded: file };
  }
}
