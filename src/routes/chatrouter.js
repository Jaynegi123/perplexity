import express from "express";

import { sendmessage, getchat, getmesage, deletechat } from "../controller/chatcontroller.js";
import { authuser } from "../middleware/authmidleware.js";

const chatrouter = express.Router();

chatrouter.post("/message", authuser, sendmessage);
chatrouter.get("/", authuser, getchat);
chatrouter.get("/:chatid/messages", authuser, getmesage);

// Delete Chat routes (supports both POST & DELETE methods)
chatrouter.post("/delete/:chatid", authuser, deletechat);
chatrouter.delete("/delete/:chatid", authuser, deletechat);
chatrouter.delete("/:chatid", authuser, deletechat);

export default chatrouter;