import { diskStorage } from 'multer';
const path = require('path');
import * as fs from 'fs';
type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMineTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

const storage = diskStorage({
  destination: './images',
  filename: function (req, file, cb) {
    //get tail
    const fileExtension: string = path.extname(file.originalname);
    // create new name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

export const saveImageToStorage = {
  storage: storage,
  fileFilter: (req, file, cb) => {
    debugger;
    validMineTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

export const isFileExtensionSafe = (fullFilePath: string): boolean => {
  debugger;
  const ext: string[] = path.extname(fullFilePath).split('.');
  const fileExtension: any = ext[ext.length - 1];
  return validFileExtensions.includes(fileExtension);
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (e) {
    console.log(e);
  }
};
