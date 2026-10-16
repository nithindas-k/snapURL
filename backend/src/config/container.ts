/**
 * Composition Root — the single place in the application that knows about
 * concrete implementations and wires them to their abstractions.
 *
 * Every other module depends only on interfaces (abstractions).
 * Only this file depends on concretions.
 */

// Repositories
import { UserRepository } from '../repositories/user.repository';
import { UrlRepository } from '../repositories/url.repository';

// Mappers
import { UserMapper } from '../mappers/user.mapper';
import { UrlMapper } from '../mappers/url.mapper';

// Services (infrastructure)
import { HashService } from '../utils/hash.service';
import { TokenService } from '../utils/token.service';
import { ShortCodeService } from '../utils/short-code.service';

// Services (domain)
import { AuthService } from '../services/auth.service';
import { UrlService } from '../services/url.service';

// Middleware
import { AuthMiddleware } from '../middleware/auth.middleware';

// Controllers
import { AuthController } from '../controllers/auth.controller';
import { UrlController } from '../controllers/url.controller';

// ─── Infrastructure layer ────────────────────────────────────────────────────
const userRepository = new UserRepository();
const urlRepository = new UrlRepository();

const userMapper = new UserMapper();
const urlMapper = new UrlMapper();

const hashService = new HashService();
const tokenService = new TokenService();
const shortCodeService = new ShortCodeService();

// ─── Domain / Application layer ──────────────────────────────────────────────
const authService = new AuthService(userRepository, hashService, tokenService, userMapper);
const urlService = new UrlService(urlRepository, shortCodeService, urlMapper);

// ─── Interface (HTTP) layer ──────────────────────────────────────────────────
export const authMiddleware = new AuthMiddleware(tokenService);
export const authController = new AuthController(authService);
export const urlController = new UrlController(urlService);
