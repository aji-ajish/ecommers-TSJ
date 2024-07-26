import express from 'express';
import { registerUser, verifyUser, loginUser, myProfile } from '../controller/user.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post("/user/register", registerUser)
router.post("/user/verify", verifyUser)
router.post("/user/login", loginUser)
router.get("/user/profile", isAuth ,myProfile)

export default router;