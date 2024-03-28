import express, { Router, Request, Response } from 'express';
import { validateData } from '../middleware/validationMiddleware';
import { userRegistrationSchema, userLoginSchema } from '../schemas/authSchemas';
import AuthController from '../controllers/AuthController';
import BaseRoutes from '../contract/BaseRoute';

class AuthRoutes extends BaseRoutes {

    public routes():void {
        this.router.post('/register', validateData(userRegistrationSchema), AuthController.register);
        this.router.post('/login', validateData(userLoginSchema), AuthController.login);
    }
}

export default new AuthRoutes().router;