
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { SubscriptionData, storeSubscription, getSubscription, removeSubscription } from './redis';
config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS // This should be an app-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
});

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "your_email@gmail.com",
//     pass: "your_app_password",
//   },
// });

// const transporter = nodemailer.createTransport({
//     service: "gmail",
    
//   auth: {
//     type: "OAuth2",
//     user: "jbniyikiza20@gmail.com",
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     //refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//   },
// });

export const sendSubscriptionConfirmation = async (email: string): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: `"Blog Journal" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Welcome to Our Blog Journal!',
            html: `
                <h1>Thank you for subscribing to our blog!</h1>
                <p>You will now receive updates about new blog posts and content.</p>
                <p>Your subscription has been confirmed and stored securely.</p>
                <p>If you wish to unsubscribe at any time, click <a href="${process.env.BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}">here</a>.</p>
                <p>Best regards,<br>Blog Journal Team</p>
            `
        });
        console.log('Subscription confirmation sent:', info.messageId);
    } catch (error) {
        console.error('Error sending subscription confirmation:', error);
        throw error;
    }
};

export const sendNewContentNotification = async (email: string): Promise<void> => {
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

// export const storeSubscriptionData = async (email: string, isActive: boolean = true): Promise<void> => {
//     try {
//         const subscriptionData: SubscriptionData = {
//             email,
//             isActive,
//             createdAt: new Date()
//         };
//         await storeSubscription(email, subscriptionData);
//     } catch (error) {
//         console.error('Error' , error);
//         throw error;
//     }
// };
export const storeSubscriptionData = async (email: string, isActive: boolean = true): Promise<void> => {
    try {
        const subscriptionData: SubscriptionData = {
            email,
            isActive,
            createdAt: new Date()
        };
        await storeSubscription(email, subscriptionData);
    } catch (error) {
        console.error('Error storing subscription data:', error);
        throw error;
    }
};

export const getSubscriptionStatus = async (email: string): Promise<boolean> => {
    try {
        const subscription = await getSubscription(email);
        return subscription?.isActive ?? false;
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return false;
    }
};
export const removeSubscriptionData = async (email: string): Promise<void> => {
    try {
        await removeSubscription(email);
    } catch (error) {
        console.error('Error removing',error);
        throw error;
    }
};