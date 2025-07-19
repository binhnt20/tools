import { BadRequestException, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/document')
  @UseInterceptors(FileInterceptor('document'))
  uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!file) {
      const message = (req as any).fileValidationError || 'No file uploaded';
      throw new BadRequestException(message);
    }
    return this.fileService.uploadDocument(file);
  }
}
