import bcrypt from 'bcryptjs';
import { IHashService } from '../services/interfaces/IHashService';
import { APP_CONSTANTS } from '../constants/app.constants';

export class HashService implements IHashService {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
