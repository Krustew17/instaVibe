import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const mailGenerator = new Mailgen({
    theme: "salted",
    product: {
        name: "instaVibe",
        link: "https://instavibe.onrender.com",
    },
});

export default async function sendEmailVerificationEmail(savedUser, token) {
    // Send email
    const host = process.env.CLIENT_HOST;
    const verificationLink = `${host}/verify-email?userId=${savedUser._id}&token=${token}`;
    const emailData = {
        body: {
            name: savedUser.username,
            intro: "Welcome to instaVibe! We're very excited to have you on board.",
            action: {
                instructions:
                    "To get started with instaVibe, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationLink,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };

    const emailBody = mailGenerator.generate(emailData);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: savedUser.email,
        subject: "Verify your email address",
        html: emailBody,
    });
    return true;
}
