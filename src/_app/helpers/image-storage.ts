import { diskStorage } from 'multer';
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
const path = require('path');
// import { from, Observable, of, switchMap } from 'rxjs';
import { fileTypeFromFile } from 'file-type';
import * as fs from 'fs';
type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions = ['png', 'jpg', 'jpeg'];
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
    // const allowMineTypes: validMimeType[] = validMineTypes;
    validMineTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

// export const isFileExtensionSafe = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   // return from(validFileExtensions.includes(fileExtension));
//   return from(fileType.fileTypeFromFile(fullFilePath)).pipe(
//     switchMap((fileExtensionAndMimeType) => {
//       debugger;
//       if (!fileExtensionAndMimeType) return of(false);
//       const { ext, mime } = fileExtensionAndMimeType;
//       // const a = ext instanceof validFileExtension;
//       return of();
//     }),
//   );
// };

export const isFileExtensionSafe = (fullFilePath: string): boolean => {
  debugger;
  const ext: string = path.extname(fullFilePath).split('.');
  const fileExtension = ext[ext.length - 1];
  return validFileExtensions.includes(fileExtension);
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (e) {
    console.log(e);
  }
};
