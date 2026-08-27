import nodemailer from 'nodemailer'

const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.googleuser,
        clientSecret: process.env.googleclintsecret,
        refreshToken: process.env.refreshtoken,
        clientId: process.env.googleclientid
    }
})
transpoter.verify().then(() => {
        console.log("transpoter is ready to send email")
    })
    .catch((err) => {
        console.error("email transpoter verification fail", err)
    })

export async function sendmail({ to, subject, html, text }) {
    const mailoption = {
        from: process.env.googleuser,
        to,
        subject,
        html,
        text
    };
    const details = await transpoter.sendMail(mailoption)
    console.log("emaildetail", details)
}