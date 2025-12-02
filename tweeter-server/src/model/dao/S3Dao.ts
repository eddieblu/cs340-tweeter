export interface S3Dao {
    uploadImage(imageStringBase64: string, imageFileExtension: string): Promise<string>;
}