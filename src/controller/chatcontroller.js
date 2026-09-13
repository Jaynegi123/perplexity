import { generateresponse, generatetitle } from "../services/aiservice.js";
import chatmodel from "../models/chat.js";
import Messagemodel from "../models/message.js";
export async function sendmessage(req, res) {
    try {
        const { message, chat: chatid } = req.body;

        const userId = req.user.id || req.user._id;

        let chat = null;

        // New chat
        if (!chatid) {
            const title = await generatetitle(message);

            chat = await chatmodel.create({
                user: userId,
                title: title
            });
        }

        // Existing chat
        else {
            chat = await chatmodel.findById(chatid);

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }
        }

        // Save user message
        const userMessage = await Messagemodel.create({
            chat: chat._id,
            content: message,
            role: "user"
        });




        const result = await generateresponse(message);

        const aimessage = await Messagemodel.create({
            chat: chat._id,
            content: result,
            role: "ai"
        });

        const messages = await Messagemodel.find({
            chat: chat._id
        }).sort({ createdAt: 1 });

        console.log("User message:", message);
        console.log("Chat ID:", chat._id);
        console.log("Messages:", messages);

        // Send response
        res.status(200).json({
            success: true,
            title: chat.title,
            chat: chat,
            messages: messages
        });

    } catch (error) {
        console.error("Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
}
export async function getchat(req, res) {

    const user = req.user

    const chats = await chatmodel.find({ user: user.id })

    res.status(200).json({
        message: "chats retrieved sucessfully",
        chats
    })
}
export async function getmesage(req, res) {
    const { chatid } = req.params;

    const chat = await chatmodel.findOne({
        _id: chatid,
        user: req.user.id
    })
    if (!chat) {
        return res.status(404).json({
            "message": "chat not found"
        })
    }
    const message = await Messagemodel.find({
        chat: chatid
    })
    res.status(200).json({
        message: "message retrevied sucessfully",
        message
    })
}
export async function deletechat(req, res) {
    try {
        const { chatid } = req.params;
        const userId = req.user.id || req.user._id;

        const chat = await chatmodel.findOneAndDelete({
            _id: chatid,
            user: userId
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        await Messagemodel.deleteMany({
            chat: chatid
        });

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete chat",
            error: error.message
        });
    }
}