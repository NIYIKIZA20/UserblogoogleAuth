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
    // console.log('Connected to Redis');
});

// redis.on('error', (err) => {
//     console.error('Redis connection error:', err);
// });

// redis.on('ready', () => {
//     console.log('Redis client ready');
// });

export default redis;