import { HttpStatus, Injectable } from '@nestjs/common';
import { IFile } from './interfaces';

@Injectable()
export class FileService {
  constructor() {}

  async uploadDocument(file: IFile) {
    const { filename: fileName, originalname: originalName, mimetype: mimeType, path } = file;
    try {
      return {
        statusCode: HttpStatus.OK,
        message: 'Success',
        url: `${process.env.PUBLIC_STATIC_URL}/${fileName}`,
      };
    } catch (error) {
      if (JSON.stringify(error).includes('Only document files'))
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        };
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };
    }
  }
}
