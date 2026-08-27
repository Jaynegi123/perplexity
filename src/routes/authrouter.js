import express from "express";

import { register } from "../controller/authcontroller.js";
import { registerValidator } from "../validator/authvalidator.js";

const router = express.Router();

router.post("/register", registerValidator, register);

export default router;