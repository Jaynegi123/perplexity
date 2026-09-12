import express from "express";
import { sendResendEmail } from "../controller/resendcontroller.js";

const router = express.Router();

router.post("/send", sendResendEmail);

export default router;
