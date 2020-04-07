import { Router } from 'express';
import  authController  from '../controllers/auth.controller';

const authRouter = Router();

authRouter.route('/auth/signin')
    .post(authController.signin);

authRouter.route('/auth/singout')
    .get(authController.signout);

export default authRouter;

