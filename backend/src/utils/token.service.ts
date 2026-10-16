import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { ITokenService, JwtPayload } from '../services/interfaces/ITokenService';

export class TokenService implements ITokenService {
  sign(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn as any });
  }

  verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  }
}
