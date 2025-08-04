import { Router } from "express";
import { subscribe, unsubscribe } from "../controller/subscriptionController";
import { ValidationMiddleware } from "../middleware/validationMiddleware";
import { SubscriptionSchema } from "../schemas/subscriptionSchema";
const subscriptionRouter = Router();

subscriptionRouter.post('/subscribe',
     ValidationMiddleware({ type: 'body', schema: SubscriptionSchema, refType: 'joi' }),
    subscribe
);
subscriptionRouter.post('/unsubscribe',
     ValidationMiddleware({ type: 'body', schema: SubscriptionSchema, refType: 'joi' }),
    unsubscribe
);
export { subscriptionRouter };