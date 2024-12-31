import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as Multer from 'multer';
import { Readable } from 'stream';
import { Response } from 'express';
import minioClient from 'src/utils/minioClient';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}
  async createBucket(bucketName: string): Promise<void> {
    try {
      const exists = await minioClient.bucketExists(bucketName);
      if (!exists) {
        await minioClient.makeBucket(bucketName, 'us-east-1');
      } else {
        console.log(`Bucket '${bucketName}' already exists.`);
      }
    } catch (error) {
      console.error('Error creating bucket:', error);
      throw error;
    }
  }

  async uploadFile(
    bucketName: string,
    file: Multer.File,
    filename: string,
  ): Promise<string> {
    try {
      const fileStream = fs.createReadStream(file.path);
      const fileSize = fs.statSync(file.path).size;

      await minioClient.putObject(bucketName, filename, fileStream, fileSize, {
        'Content-Type': file.mimetype,
      });

      const fileUrl = `${this.configService.get(process.env.MINIO_ENDPOINT)}/${bucketName}/${filename}`;

      // Optionally delete the temporary file
      fs.unlinkSync(file.path);

      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFileStream(fileName: string, bucketName: string): Promise<Readable> {
    try {
      return await minioClient.getObject(bucketName.toLowerCase(), fileName);
    } catch (error) {
      // console.error('Error fetching file stream:', error);
      throw new Error('Failed to fetch file stream');
    }
  }

  async getPresignedUrl(fileName: string, bucketName: string): Promise<string> {
    try {
      return await minioClient.presignedGetObject(
        bucketName,
        fileName,
        60 * 60,
      );
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  async streamFile(
    fileName: string,
    bucketName: string,
    res: Response,
  ): Promise<any[string]> {
    try {
      const objectStat = await minioClient.statObject(bucketName, fileName);
      const fileSize = objectStat.size;

      // Support range requests for video/audio streaming
      const range = res.req.headers.range;
      if (!range) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', fileSize);
        const stream = await minioClient.getObject(bucketName, fileName);
        return stream.pipe(res);
      }

      // Parse range headers
      const [start, end] = range
        .replace(/bytes=/, '')
        .split('-')
        .map((x) => parseInt(x, 10));
      const finalEnd = end ? end : fileSize - 1;

      res.status(206).set({
        'Content-Range': `bytes ${start}-${finalEnd}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': finalEnd - start + 1,
        'Content-Type': 'application/octet-stream',
      });

      const stream = await minioClient.getPartialObject(
        bucketName,
        fileName,
        start,
        finalEnd - start + 1,
      );

      stream.pipe(res);
    } catch (error) {
      console.error('Error in streamFile:', error);
      res.status(500).json({ message: 'Error streaming file' });
    }
  }

  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await minioClient.removeObject(bucketName, fileName);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async fileExists(bucketName: string, fileName: string): Promise<boolean> {
    try {
      await minioClient.statObject(bucketName, fileName);
      return true;
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return false;
      }
      console.error('Error checking file existence:', error);
      throw error;
    }
  }

  async bucketExists(bucketName: string): Promise<boolean> {
    try {
      return await minioClient.bucketExists(bucketName);
    } catch (error) {
      console.error('Error checking bucket existence:', error);
      throw error;
    }
  }

  async generatePresignedUrl(
    bucketName: string,
    fileName: string,
  ): Promise<{}> {
    try {
      const bucketExists = await this.bucketExists(bucketName);
      if (!bucketExists) {
        await this.createBucket(bucketName);
      }

      const expiry = 60 * 60; // 1 hour expiry time
      const timestamp = Date.now();
      const extension = fileName.split('.').pop(); // Get the file extension
      const correctedName = `${timestamp}.${extension}`;

      const url = await minioClient.presignedPutObject(
        bucketName,
        correctedName,
        expiry,
      );

      return { url, fileName: correctedName };
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      throw new Error('Error generating pre-signed URL');
    }
  }

  async getFileDetails(
    bucketName: string,
    objectName: string,
  ): Promise<Minio.BucketItemStat> {
    try {
      const metadata = await minioClient.statObject(bucketName, objectName);
      return metadata;
    } catch (error) {
      console.error('Error fetching file details:', error);
      throw error;
    }
  }

  async generatePresignedDownloadUrl(
    fileName: string,
    bucketName: string,
    expiry: number,
  ): Promise<string> {
    try {
      const url = await minioClient.presignedGetObject(
        bucketName,
        fileName,
        expiry,
      );
      return url;
    } catch (error) {
      console.error('Error generating pre-signed download URL:', error);
      throw error;
    }
  }
}
