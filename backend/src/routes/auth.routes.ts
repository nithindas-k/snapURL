import { Router } from 'express';
import { validateDto } from '../middleware/validate.middleware';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { authController } from '../config/container';

const router = Router();

router.post('/register', validateDto(RegisterDto), (req, res) => authController.register(req, res));
router.post('/login', validateDto(LoginDto), (req, res) => authController.login(req, res));

export default router;
