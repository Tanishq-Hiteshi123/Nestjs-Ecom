import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';

@Injectable()
export class FileUploaderService {
  private static uploadPath = './uploads';

  private static generateFileName(file: Express.Multer.File): string {
    const extName = path.extname(file.originalname);

    return `${file.fieldname}-${Date.now()}${extName}`;
  }

  static getDiskStorage() {
    return diskStorage({
      destination: FileUploaderService.uploadPath,
      filename(req, file, callback) {
        const generateFileName = FileUploaderService.generateFileName(file);

        return callback(null, generateFileName);
      },
    });
  }
}
