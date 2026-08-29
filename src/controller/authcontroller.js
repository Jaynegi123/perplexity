import { json } from "body-parser";
import Usermodel from "../models/usermodel.js";
import { sendmail } from "../services/mailservice.js";
import jwt from 'jsonwebtoken'


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

    const emailverification = jwt.sign({
        email: user.email,
    }, process.env.jwtsecret)



    await sendmail({
        to: email,
        subject: "welcome to perplexity",
        html: `<p>Hi ${username},</p><p>Thankyou for registration at<strong>Perplexity</strong>we are exited </p>
        <p>click on link to verify</P>
        <a href = "http://localhost:3000/api/auth/verify-email?token=${emailverification}">Verify Email</a>
        <p>Best Regards,<br>The Perpexity</br></P>`
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
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await Usermodel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        });
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify mail before login",
            success: false,
            err: "Email not verified"
        });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false
        });
    }

    const token = jwt.sign({
            id: user._id,
            username: user.username
        },
        process.env.jwtsecret, {
            expiresIn: "7d"
        }
    );

    res.cookie("token", token);

    return res.status(200).json({
        message: "Login successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        const decoded = jwt.verify(
            token,
            process.env.jwtsecret
        );

        const user = await Usermodel.findOne({
            email: decoded.email
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            });
        }

        user.verified = true;
        await user.save();

        const html = `
            <h1>Email is verified</h1>
            <p>You can Login</p>
            <a href="http://localhost:3000/login">
                Go to Login
            </a>
        `;

        res.status(200).send(html);

    } catch (error) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            error: error.message
        });
    }
}
export async function getme(req, res) {

    const userid = req.user.id;

    const user = await Usermodel
        .findOne({ _id: userid })
        .select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        });
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    });
}