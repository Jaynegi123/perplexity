import Usermodel from "../models/usermodel.js";
import { sendmail } from "../services/mailservice.js";

export async function register(req, res) {
    const { username, email, password } = req.body;

    const isuseralredyexist = await Usermodel.findOne({
        $or: [{ email }, { username }]
    })
    if (isuseralredyexist) {
        return res.status(400).json({
            message: "user with this email or username already exist!!",
            success: false,
            err: "user already exists"
        })
    }
    const user = await Usermodel.create({
        username,
        email,
        password
    })
    await sendmail({
        to: email,
        subject: "welcome to perplexity",
        html: `<p>Hi ${username},</p><p>Thankyou for registration at<strong>Perplexity</strong>we are exited </p><,<p>Best Regards,<br>The Perpe xity</br></P>`
    })
    res.status(201).json({
        message: "user registered successfully",
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });

}