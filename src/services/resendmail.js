import { Resend } from "resend";

const getResendClient = () => {
    const apiKey = process.env.resendapi;
    if (!apiKey) {
        throw new Error("resendapi environment variable is not defined");
    }
    return new Resend(apiKey);
};

export async function sendResendMail({ to, subject, html, text, from }) {
    try {
        const resend = getResendClient();
        
        const sender = from || process.env.resendfrom || process.env.googleuser || "onboarding@resend.dev";

        const mailoption = {
            from: sender,
            to,
            subject,
            ...(html && { html }),
            ...(text && { text })
        };

        const { data, error } = await resend.emails.send(mailoption);

        if (error) {
            console.error("Resend mail error:", error);
            return { success: false, error };
        }

        console.log("Resend mail sent successfully:", data);
        return { success: true, data };
    } catch (err) {
        console.error("Failed to send mail via Resend:", err.message);
        return { success: false, error: err.message };
    }
}

export const sendmail = sendResendMail;