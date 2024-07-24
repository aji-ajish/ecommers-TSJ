import express from 'express';
import { registerUser, verifyUser, loginUser } from '../controller/user.js';

const router = express.Router();

router.post("/user/register", registerUser)
router.post("/user/verify", verifyUser)
router.post("/user/login", loginUser)

export default router;