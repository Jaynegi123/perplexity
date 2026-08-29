import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authrouter from "./routes/authrouter.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authrouter);

export default app;