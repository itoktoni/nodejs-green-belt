import UserController from '../controllers/UserController';
import BaseRoutes from '../contract/BaseRoute';
import auth from '../middleware/authMiddleware';
import TransactionController from '../controllers/TransactionController';
import { validateData } from '../middleware/validationMiddleware';
import { transactionSchema } from '../schemas/TransactionSchemas';

class TransactionRoutes extends BaseRoutes {
    public routes():void {
        this.router.post('/deposit', auth, validateData(transactionSchema), TransactionController.deposit);
        this.router.post('/withdraw', auth, TransactionController.withdraw);
        this.router.post('/transfer', auth, TransactionController.transfer);
        this.router.get('/history/:account', auth, TransactionController.history);
        this.router.get('/download/:account', auth, TransactionController.download);
    }
}

export default new TransactionRoutes().router;