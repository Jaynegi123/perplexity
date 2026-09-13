import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authrouter from "./routes/authrouter.js";
import resendrouter from "./routes/resendrouter.js";
import chatrouter from './routes/chatrouter.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authrouter);
app.use("/api/resend", resendrouter);


app.use('/api/chat', chatrouter)

export default app;