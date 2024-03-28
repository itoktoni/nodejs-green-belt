import UserController from '../controllers/UserController';
import BaseRoutes from '../contract/BaseRoute';
import auth from '../middleware/authMiddleware';

class UserRoutes extends BaseRoutes {
    public routes():void {
        this.router.get('/', auth, UserController.list);
        this.router.get('/profile', auth, UserController.profile);
    }
}

export default new UserRoutes().router;