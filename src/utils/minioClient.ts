import { Client } from 'minio';

const minioClient = new Client({
  endPoint:  process.env.MINIO_ENDPOINT||'localhost',
  port: 9000,            // Your MinIO port (default 9000)
  useSSL: false,         // Set true if using HTTPS
  accessKey: process.env.MINIO_ROOT_USER || 'minioadmin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'miniopassword',
});

export default minioClient;
