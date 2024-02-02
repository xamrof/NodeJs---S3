import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} from "./config.js";
import fs from "fs";

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };

  const command = new PutObjectCommand(uploadParams);
  return await client.send(command);
}

export async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });
  return await client.send(command);
}

export async function getFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 120 });
  return url;

  // const str = await response.Body.transformToString();
  // console.log(str);
}

export async function downloadFile(fileName) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });
  const result = await client.send(command);
  result.Body.pipe(fs.createWriteStream(`./images/${fileName}`));
}
