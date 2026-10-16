export interface JwtPayload {
  sub: string;
  email: string;
}

export interface ITokenService {
  sign(payload: JwtPayload): string;
  verify(token: string): JwtPayload;
}
