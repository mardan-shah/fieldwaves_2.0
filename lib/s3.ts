import { S3Client } from "@aws-sdk/client-s3";

// Sanitize endpoint: Remove trailing slash and bucket name if accidentally included
let endpoint = process.env.S3_ENDPOINT || "";
if (endpoint) {
  endpoint = endpoint.replace(/\/$/, "");
  // If endpoint includes the bucket name at the end (like in the user screenshot), strip it
  // Cloudflare R2 S3 API expects the account-level endpoint, not the bucket-level endpoint
  const bucketName = process.env.S3_BUCKET_NAME || "fieldwaves";
  if (endpoint.endsWith(`/${bucketName}`)) {
    endpoint = endpoint.substring(0, endpoint.length - bucketName.length - 1);
  }
}

const s3Client = new S3Client({
  endpoint: endpoint,
  region: "auto", // Recommended for Cloudflare R2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export default s3Client;
