import { Router } from 'express';
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';
const userRouter = Router();

userRouter.route('/api/users')
    .get(userController.getAll)
    .post(userController.postOne)
    .delete(userController.deleteAll);

userRouter.route('/api/users/:userId')
    .get(authController.requireSignin, userController.getOne)
    .put(authController.requireSignin, authController.hasAuthorization, userController.updateOne)
    .delete(authController.requireSignin, authController.hasAuthorization, userController.deleteOne)

userRouter.param('userId', userController.userById);


export default userRouter;


