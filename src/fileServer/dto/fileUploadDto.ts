import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Multer } from 'multer';

export class FileUploadDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsOptional()
  file: Multer.File;
}
