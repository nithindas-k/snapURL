import { IAuthService, AuthResponseDto } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IHashService } from './interfaces/IHashService';
import { ITokenService } from './interfaces/ITokenService';
import { IUserMapper, UserResponseDto } from '../mappers/interfaces/IUserMapper';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../errors/app.error';

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
    private userMapper: IUserMapper
  ) {}

  async register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<UserResponseDto> {
    if (password !== confirmPassword) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_MISMATCH, STATUS_CODES.BAD_REQUEST);
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(MESSAGES.AUTH.USER_EXISTS, STATUS_CODES.CONFLICT);
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = await this.userRepository.create(email, hashedPassword);
    return this.userMapper.toResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const accessToken = this.tokenService.sign({
      sub: (user._id as any).toString(),
      email: user.email,
    });

    return {
      user: this.userMapper.toResponse(user),
      accessToken,
    };
  }
}
