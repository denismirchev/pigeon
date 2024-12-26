import { Router } from 'express';
import authRouter from '@src/routes/routers/AuthRouter';
import postRouter from '@src/routes/routers/PostRouter';
import userRouter from '@src/routes/routers/UserRouter';
import Paths from '@src/common/Paths';
import authenticateMw from '@src/routes/middleware/authenticateMw';

const apiRouter = Router();

apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Posts.Base, authenticateMw, postRouter);
apiRouter.use(Paths.Users.Base, userRouter);

export default apiRouter;
