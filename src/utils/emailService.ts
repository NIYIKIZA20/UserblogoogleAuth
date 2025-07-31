
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
export const sendSubscriptionConfirmation = async (email: string) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to Our Newsletter!',
            html: `
                <h1>Thank you for subscribing!</h1>
                <p>You will now receive updates whenever new content is published.</p>
                <p>If you wish to unsubscribe, click <a href="${process.env.BASE_URL}/unsubscribe">here</a>.</p>
            `
        });
    } catch (error) {
        console.error('Error sending subscription confirmation:', error);
        throw error;
    }
};
export const sendNewContentNotification = async (email: string, content: { title: string, description: string }) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: `New Post: ${content.title}`,
            html: `
                <h1>${content.title}</h1>
                <p>${content.description}</p>
                <p>Read more at: ${process.env.BASE_URL}/blog/${content.title}</p>
            `
        });
    } catch (error) {
        console.error('Error sending content notification:', error);
        throw error;
    }
};