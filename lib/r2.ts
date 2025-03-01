import { S3Client } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.CF_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY!,
  },
});

export default r2Client;
