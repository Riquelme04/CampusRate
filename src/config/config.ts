import * as dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT);

if (!process.env.PORT || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT absent ou invalide');
}

export const config = {
  port,
};
