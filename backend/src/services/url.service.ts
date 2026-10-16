import { IUrlService } from './interfaces/IUrlService';
import { IUrlRepository } from '../repositories/interfaces/IUrlRepository';
import { IUrlMapper, UrlResponseDto } from '../mappers/interfaces/IUrlMapper';
import { IShortCodeService } from './interfaces/IShortCodeService';
import { appConfig } from '../config/app.config';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../errors/app.error';

export class UrlService implements IUrlService {
  constructor(
    private urlRepository: IUrlRepository,
    private shortCodeService: IShortCodeService,
    private urlMapper: IUrlMapper
  ) {}

  async createShortUrl(originalUrl: string, userId: string): Promise<UrlResponseDto> {
    // Check if this user already shortened the same URL
    const existing = await this.urlRepository.findByOriginalUrlAndUserId(originalUrl, userId);
    if (existing) {
      throw new AppError(
        MESSAGES.URL.ALREADY_EXISTS,
        STATUS_CODES.CONFLICT,
        this.urlMapper.toResponse(existing, appConfig.baseUrl)
      );
    }

    let shortCode: string;
    let exists = true;

    // generate unique short code — retry on collision
    do {
      shortCode = this.shortCodeService.generate();
      exists = await this.urlRepository.shortCodeExists(shortCode);
    } while (exists);

    const url = await this.urlRepository.create(originalUrl, shortCode, userId);
    return this.urlMapper.toResponse(url, appConfig.baseUrl);
  }

  async getUserUrls(userId: string): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    return this.urlMapper.toResponseList(urls, appConfig.baseUrl);
  }

  async resolveShortCode(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new AppError(MESSAGES.URL.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    await this.urlRepository.incrementClickCount(shortCode);
    return url.originalUrl;
  }
}
