import { Request, Response } from 'express';
import { ResponseService } from "../utils/response";
import { Database } from '../database';
import { sendSubscriptionConfirmation, sendNewContentNotification, storeSubscriptionData,removeSubscriptionData } from '../utils/emailService';
import { getSubscription } from '../utils/redis';

export const subscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        // Check Redis first
        const existingRedisSubscription = await getSubscription(email);
        if (existingRedisSubscription && existingRedisSubscription.isActive) {
            return ResponseService({
                data: null,
                status: 400,
                success: false,
                message: "Email already subscribed",
                res
            });
        }
        // Check database
        const existingSubscription = await Database.Subscription.findOne({
            where: { email }
        });
        
        if (existingSubscription && existingSubscription.isActive) {
            return ResponseService({
                data: null,
                status: 400,
                success: false,
                message: "Email already subscribed",
                res
            });
        }
        // Create or update subscription
        const subscription = await Database.Subscription.create({
            email,
            isActive: true
        });
        // Store in Redis
        await storeSubscriptionData(email);
        
        // Send confirmation email
        await sendSubscriptionConfirmation(email);
        ResponseService({
            data: subscription.toJSON(),
            status: 201,
            success: true,
            message: "Successfully subscribed to newsletter",
            res
        });
    } catch (error) {
        const { message } = error as Error;
        ResponseService({
            message: message || "Failed to process subscription",
            data: null,
            status: 500,
            success: false,
            res
        });
    }
};
// export const subscribe = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;
//         const existingSubscription = await Database.Subscription.findOne({
//             where: { email }
//         });
//         if (existingSubscription) {
//             return ResponseService({
//                 data: null,
//                 status: 400,
//                 success: false,
//                 message: "Email already subscribed",
//                 res
//             });
//         }
//         const subscription = await Database.Subscription.create({
//             email,
//             isActive: true
//         });
//         await storeSubscriptionData(email);
//         await sendSubscriptionConfirmation(email);
//         ResponseService({
//             data: subscription.toJSON(),
//             status: 201,
//             success: true,
//             message: "Successfully subscribed to newsletter",
//             res
//         });
//     } catch (error) {
//         const { message, stack } = error as Error;
//         ResponseService({
//             message: message,
//             data: null,
//             status: 500,
//             success: false,
//             res
//         });
//     }
// };

   export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        // Check Redis first
        const redisSubscription = await getSubscription(email);
        if (!redisSubscription) {
            // Check database if not in Redis
            const subscription = await Database.Subscription.findOne({
                where: { email }
            });
            
            if (!subscription) {
                return ResponseService({
                    data: null,
                    status: 404,
                    success: false,
                    message: "Subscription not found",
                    res
                });
            }
        }
        // Remove from Redis
        await removeSubscriptionData(email);
        
        // Update database
        const subscription = await Database.Subscription.findOne({
            where: { email }
        });
        if (subscription) {
            await subscription.update({ isActive: false });
        }
        ResponseService({
            data: null,
            status: 200,
            success: true,
            message: "Successfully unsubscribed from newsletter",
            res
        });
    } catch (error) {
        const { message } = error as Error;
        ResponseService({
            data: null,
            message: message || "An error occurred while unsubscribing",
            status: 500,
            success: false,
            res
        });
    }
};
// export const unsubscribe = async (req: Request, res: Response) => {
//     try {
//         const { email } = req.body;
//         const subscription = await Database.Subscription.findOne({
//             where: { email }
//         });
//         if (!subscription) {
//             return ResponseService({
//                 data: null,
//                 status: 404,
//                 success: false,
//                 message: "Subscription not found",
//                 res
//             });
//         }
//         await removeSubscriptionData(email);
//         await subscription.update({ isActive: false });
//         ResponseService({
//             data: null,
//             status: 200,
//             success: true,
//             message: "Successfully unsubscribed from newsletter",
//             res
//         });
//     } catch (error) {
//         const { message, stack } = error as Error;
//         ResponseService({
        
//             data: null,
//             message: message || "An error occurred while unsubscribing",
//             status: 500,
//             success: false,
//             res
//         });
//     }
// };
export const notifySubscribers = async (blogId: string) => {
    try {
        const blog = await Database.Blog.findByPk(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        const activeSubscribers = await Database.Subscription.findAll({
            where: { isActive: true }
        });

        for (const subscriber of activeSubscribers) {
            await sendNewContentNotification(subscriber.email);
        }
    } catch (error) {
        console.error('Error notifying subscribers:', error);
        throw error;
    }
};