import { Module } from '@nestjs/common';
import { FileServerModule } from './fileServer/fileServer.module';


@Module({
  imports: [
    FileServerModule,
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class AppModule {}
