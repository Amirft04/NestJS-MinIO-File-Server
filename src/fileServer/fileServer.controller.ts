import { Controller, Get, Param, Post, Body, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileService } from './fileServer.service';
import { Response } from 'express';
import { FileUploadDto } from './dto/fileUploadDto';

@Controller('fileServer')
export class FileServerController {
  constructor(private readonly fileServerService: FileService) {}

  @Get('presign-upload/:fileName/:bucketName')
  async generatePresignedUrl(
    @Param('fileName') fileName: string,
    @Param('bucketName') bucketName: string,
  ) {
    return this.fileServerService.generatePresignedUrl(bucketName, fileName);
  }

  @Get('getfile/:fileName/:bucketName/:fileType/:token')
  async getFile(
    @Param('fileName') fileName: string,
    @Param('bucketName') bucketName: string,
    @Param('fileType') fileType: string,
    @Res() res: Response,
  ) {
    try {
      // Handle streaming for video/audio
      if (fileType.startsWith('video') || fileType.startsWith('audio')) {
        return await this.fileServerService.streamFile(fileName, bucketName, res);
      }
      // Directly serve images
      if (fileType.startsWith('image')) {
        const fileStream = await this.fileServerService.getFileStream(fileName, bucketName);
        res.setHeader('Content-Type', `image/${fileName.split('.')[1]}`);
        return fileStream.pipe(res);
      }

      // Provide presigned URL for download for other files
      const presignedUrl = await this.fileServerService.getPresignedUrl(fileName, bucketName);
      res.redirect(presignedUrl);
    } catch (error) {
      console.error('Error in getFile:', error);
      res.status(500).json({ message: 'Error fetching file' });
    }
  }

  @Post('upload-file/:bucketName')
  async uploadFile(
    @Param('bucketName') bucketName: string,
    @Body() fileUploadDto: FileUploadDto, // Assuming you handle file upload via a DTO
  ) {
    try {
      const fileUrl = await this.fileServerService.uploadFile(
        bucketName,
        fileUploadDto.file, // Assuming the file comes from the DTO
        fileUploadDto.filename,
      );
      return { fileUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new HttpException('Error uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create-bucket/:bucketName')
  async createBucket(@Param('bucketName') bucketName: string) {
    try {
      await this.fileServerService.createBucket(bucketName);
      return { message: `Bucket ${bucketName} created successfully.` };
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw new HttpException('Error creating bucket', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('file-details/:bucketName/:fileName')
  async getFileDetails(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const metadata = await this.fileServerService.getFileDetails(bucketName, fileName);
      return metadata;
    } catch (error) {
      console.error('Error fetching file details:', error);
      throw new HttpException('Error fetching file details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('delete-file/:bucketName/:fileName')
  async deleteFile(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      await this.fileServerService.deleteFile(bucketName, fileName);
      return { message: 'File deleted successfully.' };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('check-file-exists/:bucketName/:fileName')
  async fileExists(
    @Param('bucketName') bucketName: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const exists = await this.fileServerService.fileExists(bucketName, fileName);
      return { exists };
    } catch (error) {
      console.error('Error checking file existence:', error);
      throw new HttpException('Error checking file existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('bucket-exists/:bucketName')
  async bucketExists(@Param('bucketName') bucketName: string) {
    try {
      const exists = await this.fileServerService.bucketExists(bucketName);
      return { exists };
    } catch (error) {
      console.error('Error checking bucket existence:', error);
      throw new HttpException('Error checking bucket existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
