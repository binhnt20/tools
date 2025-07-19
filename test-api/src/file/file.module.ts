import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { cleanString } from '../share/tools/functions';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './src/public/uploads');
        },
        filename: (req, file, cb) => {
          const fileName = file.originalname.split('.').slice(0, -1).join(''),
            extName = file.originalname.split('.').slice(-1).join('');
          const newFileName = `${uuid()}-${cleanString(fileName)}.${extName}`;

          cb(null, `${newFileName}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter(req, file, callback) {
        if (
          !file.mimetype.match(
            /application\/(msword|vnd\.openxmlformats-officedocument\.(wordprocessingml|spreadsheetml|presentationml)\.document|pdf)|text\/plain/,
          ) &&
          req.url.includes('/upload/document')
        ) {
          req.fileValidationError = 'Only document files (.doc, .docx, .pdf, .xls, .xlsx, .ppt, .pptx, .txt) are allowed.';
          return callback(
            null,
            false,
          );
        }

        callback(null, true);
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
