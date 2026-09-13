import { sendResendMail } from "../services/resendmail.js";
export async function sendResendEmail(req, res) {
    try {
        const { to, subject, html, text, from } = req.body;
        if (!to || !subject) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: 'to' and 'subject' are required."
            });
        }
        if (!html && !text) {
            return res.status(400).json({
                success: false,
                message: "Email body is required: provide either 'html' or 'text'."
            });
        }
        const result = await sendResendMail({ to, subject, html, text, from });
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email via Resend.",
                error: result.error
            });
        }
        return res.status(200).json({
            success: true,
            message: "Email sent successfully via Resend.",
            data: result.data
        });
    } catch (error) {
        console.error("Error in sendResendEmail controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while sending email.",
            error: error.message
        });
    }
}
export const resendMailController = sendResendEmail;
export default sendResendEmail;