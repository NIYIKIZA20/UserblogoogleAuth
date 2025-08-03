import { createClient } from 'redis';
import { config } from 'dotenv';

config();

export const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '13750'),
    },
    password: process.env.REDIS_PASSWORD,
    database: parseInt(process.env.REDIS_DATABASE || '0'),
});

redis.on('connect', () => {
     console.log('Connected to Redis client');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

/**
 * Subscription-related Redis utility methods
 */
interface SubscriptionData {
    email: string;
    isActive: boolean;
    createdAt: Date;
}
const SUBSCRIPTION_TTL = 24 * 60 * 60; // 24 hours in seconds
/**
 * Stores a subscription in Redis
 * @param email - Subscriber's email address
 * @param data - Subscription data to store
 * @throws Error if storage fails
 */
export const storeSubscription = async (email: string, data: SubscriptionData): Promise<void> => {
    try {
        await redis.setEx(
            `subscription:${email}`, 
            SUBSCRIPTION_TTL,
            JSON.stringify(data)
        );
    } catch (error) {
        console.error('Error storing subscription:', error);
        throw new Error('Failed to store subscription data');
    }
};
/**
 * Retrieves a subscription from Redis
 * @param email - Subscriber's email address
 * @returns The subscription data or null if not found
 * @throws Error if retrieval fails
 */
export const getSubscription = async (email: string): Promise<SubscriptionData | null> => {
    try {
    const data = await redis.get(`subscription:${email}`);
    return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error retrieving subscription:', error);
        throw new Error('Failed to retrieve subscription data');
    }
};
/**
 * Removes a subscription from Redis
 * @param email - Subscriber's email address
 * @throws Error if removal fails
 */
export const removeSubscription = async (email: string): Promise<void> => {
    try {
    await redis.del(`subscription:${email}`);
    } catch (error) {
        console.error('Error removing subscription:', error);
        throw new Error('Failed to remove subscription');
    }
};
export default redis;