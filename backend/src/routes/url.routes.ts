import { Router } from 'express';
import { validateDto } from '../middleware/validate.middleware';
import { CreateUrlDto } from '../dtos/url/create-url.dto';
import { authMiddleware, urlController } from '../config/container';

const router = Router();

const protect = (req: any, res: any, next: any) => authMiddleware.protect(req, res, next);

router.post('/', protect, validateDto(CreateUrlDto), (req, res) => urlController.createShortUrl(req, res));
router.get('/', protect, (req, res) => urlController.getUserUrls(req, res));

export default router;
