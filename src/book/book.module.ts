import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BullModule } from '@nestjs/bull';
import { UploadProcessor } from './processors/upload.processor';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'file-upload-queue',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [BookService, UploadProcessor],
  controllers: [BookController],
  exports: [BullModule, UploadProcessor],
})
export class BookModule {}
