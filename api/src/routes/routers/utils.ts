import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import { ROOT_DIR } from '@src/config';
import fs from 'fs';

// TODO: add file naming option
export const createStorage = (uploadDir: string) => multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    const uploadPath = path.join(ROOT_DIR, uploadDir);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
