# NestJS MinIO File Server

This project implements a MinIO file server using NestJS. It allows you to manage files, generate presigned URLs for uploads, stream and download files, and manage buckets in a scalable and easy-to-use manner.

## Features

- **Presigned URLs**: Generates presigned URLs for secure file uploads to specific MinIO buckets.
- **File Uploads**: Upload files to MinIO buckets via `multipart/form-data`.
- **Streaming Support**: Supports streaming of media files (e.g., video, audio) and direct downloads for other file types.
- **Bucket Management**: Allows creating new buckets in MinIO and checking if buckets or files exist.
- **File Metadata**: Retrieve file metadata, including size, last modified date, and content type.
- **File Deletion**: Delete files from MinIO buckets.
- **CORS Enabled**: Cross-Origin Resource Sharing (CORS) is enabled to allow frontend communication from any origin.
- **Scalability**: Scalable architecture using NestJS and MinIO for large-scale file handling.

## Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [NestJS CLI](https://docs.nestjs.com/)
- [MinIO](https://min.io/) (configured and running)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-repository/nestjs-minio-file-server.git
cd nestjs-minio-file-server
```
### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables 

Create a .env file in the root of your project and add the following configuration:
Adjust the MINIO_ACCESS_KEY, MINIO_SECRET_KEY, and MINIO_BUCKET_NAME as per your MinIO setup.
```bash
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_ENDPOINT=localhost:9000
MINIO_BUCKET_NAME=your-bucket-name
```
### 4. Run the application

```bash
npm run start:dev
```
This will start the NestJS server on http://localhost:3000. You can now interact with the file server via the provided endpoints.


## API Endpoints

1. Generate Presigned URL for Upload
- Endpoint: GET /fileServer/presign-upload/:fileName/:bucketName
- Description: Generates a presigned URL for uploading a file to a specific bucket.
- Example: GET /fileServer/presign-upload/sample.txt/my-bucket
2. Get File (Download or Stream)
- Endpoint: GET /fileServer/getfile/:fileName/:bucketName/:fileType/:token
- Description: Fetches a file from the server. Supports streaming for video/audio files and direct download for images.
- Example: GET /fileServer/getfile/sample.txt/my-bucket/text/123456
3. Upload File
- Endpoint: POST /fileServer/upload-file/:bucketName
- Description: Uploads a file to the specified bucket.
- Example: POST /fileServer/upload-file/my-bucket
- Request Body: Includes file data (e.g., file and filename fields).
4. Create Bucket
- Endpoint: POST /fileServer/create-bucket/:bucketName
- Description: Creates a new bucket in MinIO.
- Example: POST /fileServer/create-bucket/my-new-bucket
5. Get File Details
- Endpoint: GET /fileServer/file-details/:bucketName/:fileName
- Description: Retrieves metadata/details of a file in the specified bucket.
- Example: GET /fileServer/file-details/my-bucket/sample.txt
6. Delete File
- Endpoint: GET /fileServer/delete-file/:bucketName/:fileName
- Description: Deletes a file from the specified bucket.
- Example: GET /fileServer/delete-file/my-bucket/sample.txt
7. Check If File Exists
- Endpoint: GET /fileServer/check-file-exists/:bucketName/:fileName
- Description: Checks if a file exists in the specified bucket.
- Example: GET /fileServer/check-file-exists/my-bucket/sample.txt
8. Check If Bucket Exists
- Endpoint: GET /fileServer/bucket-exists/:bucketName
- Description: Checks if a bucket exists in MinIO.
- Example: GET /fileServer/bucket-exists/my-bucket

## File Uploads

To upload a file, send a POST request to the /fileServer/upload-file/:bucketName endpoint. The file will be uploaded to the specified MinIO bucket.

Ensure the body contains the file as a multipart form-data request.

## CORS Configuration

CORS is enabled in the application to allow cross-origin requests. The server accepts requests from any origin (origin: '*') and supports the following HTTP methods:

* GET,HEAD,PUT,PATCH,POST,DELETE
If you're accessing the server from a different domain, ensure that the CORS policy is compatible with your frontend setup.

## Project Structure

The project is organized as follows:
```graphql
src/
├── fileServer/
│   ├── fileServer.controller.ts  # Handles the file server routes
│   ├── fileServer.service.ts     # Contains the business logic for interacting with MinIO
│   └── dto/
│       └── file-upload.dto.ts    # Data transfer object for file uploads
└── app.module.ts                 # Main application module
└── main.ts                       # Bootstrapping the NestJS app
```
## Troubleshooting

- MinIO connection error: Ensure your MinIO server is running and accessible. Double-check your .env configuration for the correct MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY.
- CORS issues: If you are testing from a different domain, ensure that your frontend app is making requests to the correct URL (localhost:3000 by default) and that CORS is properly configured.
## Contributing

Feel free to open issues or pull requests if you have suggestions or improvements!

## License

## License

This project is licensed under the [MIT License](LICENSE).  
You are free to use, modify, and distribute this project, provided you include a copy of the license with your work.

For more details, see the full license text in the [LICENSE](./LICENSE) file.

