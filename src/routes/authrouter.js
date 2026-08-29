import express from "express";

import { getme, login, register, verifyEmail } from "../controller/authcontroller.js";
import { loginvalidator, registerValidator } from "../validator/authvalidator.js";
import { authuser } from '../middleware/authmidleware.js'

const router = express.Router();

router.post("/register", registerValidator, register);
router.get('/verify-email', verifyEmail)
router.post('/login', loginvalidator, login)
router.get('/getme', authuser, getme)


export default router;