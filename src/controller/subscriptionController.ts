import { Request, Response } from 'express';
import { ResponseService } from "../utils/response";
import { Database } from '../database';
import { sendSubscriptionConfirmation, sendNewContentNotification } from '../utils/emailService';
export const subscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        // Check if already subscribed
        const existingSubscription = await Database.Subscription.findOne({
            where: { email }
        });
        if (existingSubscription) {
            return ResponseService({
                data: null,
                status: 400,
                success: false,
                message: "Email already subscribed",
                res
            });
        }
        // Create new subscription
        const subscription = await Database.Subscription.create({
            email,
            isActive: true
        });
        // Send confirmation email
        await sendSubscriptionConfirmation(email);
        ResponseService({
            data: subscription.toJSON(),
            //stack: null,
            status: 201,
            success: true,
            message: "Successfully subscribed to newsletter",
            res
        });
    } catch (error) {
        const { message, stack } = error as Error;
        ResponseService({
            message: message,
            //stack: stack || null,
            data: null,
            status: 500,
            success: false,
            res
        });
    }
};
export const unsubscribe = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
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
        await subscription.update({ isActive: false });
        ResponseService({
            data: null,
            status: 200,
            success: true,
            message: "Successfully unsubscribed from newsletter",
            res
        });
    } catch (error) {
        const { message, stack } = error as Error;
        ResponseService({
        
            data: null,
            message: message || "An error occurred while unsubscribing",
            //stack: stack || null,
            status: 500,
            success: false,
            res
        });
    }
};
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