import { S3Dao } from "../S3Dao";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export class AwsS3Dao implements S3Dao {
  private readonly s3 = new S3Client({});
  private readonly bucketName = "tweeter-profile-images-340752798304";

  public async uploadImage(
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<string> {
    const key = `profile-images/${randomUUID()}.${imageFileExtension}`;

    const imageAsBytes = Buffer.from(imageStringBase64, "base64");

    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageAsBytes,
      ContentType: this.getMimeType(imageFileExtension),
    });

    await this.s3.send(putCommand);

    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  private getMimeType(ext: string): string {
    switch (ext.toLowerCase()) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return "application/octet-stream";
    }
  }
}
