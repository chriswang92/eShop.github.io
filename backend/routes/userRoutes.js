import express from 'express';
const router = express.Router();
import { authUser, registerUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);
router.post('/login', authUser);
// protect middleware will run whenever we hit this route
router.route('/profile').get(protect, getUserProfile);

export default router;
