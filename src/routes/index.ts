import { userRouter } from "./userRoutes";
import { blogRouter } from "./blogRoutes";
import { commentRouter } from "./commentRoutes";
import { subscriptionRouter } from './subscriptionRoutes';
import { Router } from "express";

const routers = Router();
const allRoutes = [userRouter, blogRouter, commentRouter, subscriptionRouter];
routers.use('/api', ...allRoutes);
export { routers };


// routers.use('/api', subscriptionRouter);