import * as dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT);
const dataFilePath = process.env.DATA_FILE_PATH;

if (!process.env.PORT || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT absent ou invalide');
}

if (!dataFilePath || dataFilePath.trim() === '') {
  throw new Error('DATA_FILE_PATH absent ou invalide');
}

export const config = {
  port,
  dataFilePath,
};