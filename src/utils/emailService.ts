
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

// var transport = nodemailer.createTransport({
//   host: "live.smtp.mailtrap.io",
//   port: 587,
//   auth: {
//     user: "api",
//     pass: "<YOUR_API_TOKEN>"
//   }
// });

export const sendSubscriptionConfirmation = async (email: string):Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Welcome to Our blog journal!',
            html: `
                <h1>Thank you for subscription with us!</h1>
                <p>You will be receiving some updates regarding to our blog.</p>
                <p>If you wish to unsubscribe, click <a href="${process.env.BASE_URL}/unsubscribe">here</a>.</p>`
        });
    } catch (error) {
        console.error('Error sending subscription confirmation:', error);
        throw error;
    }
};


export const sendUnsubscribeConfirmation = async (email: string): Promise<void> => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Unsubscription Confirmed',
            html: `
                <h1>Unsubscription Confirmed</h1>
                <p>You have been successfully unsubscribed from our blog updates.</p>
                <p>We hope to see you again soon!</p>`
        });
    } catch (error) {
        console.error('Error sending unsubscribe confirmation:', error);
        throw error;
    }
};