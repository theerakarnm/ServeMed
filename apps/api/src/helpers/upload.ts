import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import { DigitalOceanSpaceService, type DigitalOceanSpaceConfig } from "src/utils/object_storage";
import { uuidv7 } from "uuidv7";

// Utility function to handle upload to DO Spaces
export const uploadToSpaces = async (
  localFilePath: string,
  originalFilename: string,
  mimetype: string
) => {
  const fileBuffer = readFileSync(localFilePath);
  const fileExtension = originalFilename.split(".").pop() || "";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}-${uuidv7()}.${fileExtension}`;
  const key = `uploads/${filename}`;

  // Initialize Digital Ocean Spaces service
  const spaceConfig: DigitalOceanSpaceConfig = {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || "",
    region: process.env.DO_SPACES_REGION || "nyc3",
    endpoint: process.env.DO_SPACES_ENDPOINT || "https://nyc3.digitaloceanspaces.com",
    bucket: process.env.DO_SPACES_BUCKET || "",
  };

  const spaceService = new DigitalOceanSpaceService(spaceConfig);

  try {
    const url = await spaceService.uploadFile(
      key,
      fileBuffer,
      mimetype,
      true // Make public
    );

    // Clean up the temporary file
    unlinkSync(localFilePath);

    return {
      url,
      key,
      filename,
      originalFilename,
    };
  } catch (error) {
    // Clean up the temporary file on error
    unlinkSync(localFilePath);
    throw error;
  }
};
