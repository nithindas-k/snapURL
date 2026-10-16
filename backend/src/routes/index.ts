import { Router } from 'express';
import authRoutes from './auth.routes';
import urlRoutes from './url.routes';
import { urlController } from '../config/container';

const router = Router();

// Public redirect route — no auth needed
router.get('/r/:shortCode', (req, res) => urlController.redirect(req, res));

router.use('/api/auth', authRoutes);
router.use('/api/urls', urlRoutes);

export default router;
