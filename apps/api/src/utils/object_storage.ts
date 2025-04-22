import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  type ListObjectsV2CommandOutput,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from "node:stream";

export interface DigitalOceanSpaceConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  bucket: string;
}

export class DigitalOceanSpaceService {
  private client: S3Client;
  private bucket: string;

  constructor(config: DigitalOceanSpaceConfig) {
    this.bucket = config.bucket;
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Upload a file to Digital Ocean Spaces
   */
  async uploadFile(
    key: string,
    body: Buffer | Readable | string,
    contentType?: string,
    isPublic = false
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: isPublic ? "public-read" : "private",
      });

      await this.client.send(command);
      return `https://${this.bucket}.${this.client.config.endpoint?.toString()?.split("https://")[1]}/${key}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  /**
   * Get an object from Digital Ocean Spaces
   */
  async getObject(key: string): Promise<GetObjectCommandOutput> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await this.client.send(command);
    } catch (error) {
      console.error("Error getting object:", error);
      throw error;
    }
  }

  /**
   * Convert GetObjectCommandOutput to Buffer
   */
  async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Check if an object exists
   */
  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * List objects in a directory
   */
  async listObjects(
    prefix?: string,
    maxKeys = 1000
  ): Promise<ListObjectsV2CommandOutput> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      return await this.client.send(command);
    } catch (error) {
      console.error("Error listing objects:", error);
      throw error;
    }
  }

  /**
   * Delete an object
   */
  async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      console.error("Error deleting object:", error);
      throw error;
    }
  }

  /**
   * Update an object (by replacing it)
   */
  async updateObject(
    key: string,
    body: Buffer | Readable | string,
    contentType?: string,
    isPublic = false
  ): Promise<string> {
    // In S3-compatible storage, updating is the same as creating
    return this.uploadFile(key, body, contentType, isPublic);
  }

  /**
   * Generate a pre-signed URL for temporary access
   */
  async getSignedUrl(
    key: string,
    expiresIn = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
    }
  }
}
