import { Router } from "express";
import { addUser, loginUser, logoutUser, getAllUsers,getSingleUser } from "../controller/userController";
import { ValidationMiddleware } from "../middleware/validationMiddleware";
import { AddUserSchema, LoginUserSchema } from "../schemas/userSchema";
import passport from "../utils/passport";
import {
    generateOAuthToken,
    handleOAuthCallback
} from "../middleware/outhMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { get } from "http";

const userRouter = Router();

userRouter.post('/users', 
    ValidationMiddleware({ type: 'body', schema: AddUserSchema, refType: 'joi' }),
    addUser
);

userRouter.get('/users', getAllUsers);
userRouter.get('/users/:id', getSingleUser);

userRouter.post('/login', 
    ValidationMiddleware({ type: 'body', schema: LoginUserSchema, refType: 'joi' }),
    loginUser
);

userRouter.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRouter.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    generateOAuthToken,
    handleOAuthCallback
);

userRouter.post('/logout', authMiddleware, logoutUser);

export { userRouter };