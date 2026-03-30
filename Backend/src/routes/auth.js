import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { userSchema, loginSchema } from '../validators/userValidator.js';

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
