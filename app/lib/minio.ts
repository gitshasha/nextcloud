import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost", // MinIO Server
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false, // Change to true if using HTTPS
  accessKey: process.env.MINIO_ACCESS_KEY ,
  secretKey: process.env.MINIO_SECRET_KEY 
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "uploads";
