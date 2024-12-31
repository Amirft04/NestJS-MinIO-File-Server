import { Module } from '@nestjs/common';
import { FileServerController } from './fileServer.controller';
import { FileService } from './fileServer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [FileServerController],
  providers: [FileService, ConfigService],
  exports: [FileService],
})
export class FileServerModule {}
