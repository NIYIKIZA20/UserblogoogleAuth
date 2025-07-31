import { userRouter } from "./userRoutes";
import { blogRouter } from "./blogRoutes";
import { commentRouter } from "./commentRoutes";

import { Router } from "express";

const routers = Router();
const allRoutes = [userRouter, blogRouter, commentRouter];
routers.use('/api', ...allRoutes);
export { routers };

// Add to imports
// import { subscriptionRouter } from './subscriptionRoutes';
// // Add to routers
// routers.use('/api', subscriptionRouter);