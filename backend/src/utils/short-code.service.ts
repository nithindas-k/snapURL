import crypto from 'crypto';
import { IShortCodeService } from '../services/interfaces/IShortCodeService';
import { APP_CONSTANTS } from '../constants/app.constants';

export class ShortCodeService implements IShortCodeService {
  generate(): string {
    return crypto
      .randomBytes(APP_CONSTANTS.SHORT_CODE_LENGTH)
      .toString('base64url')
      .slice(0, APP_CONSTANTS.SHORT_CODE_LENGTH);
  }
}
