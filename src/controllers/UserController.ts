import { Router, Request, Response } from 'express';
import ControllerInterface from '../contract/ControllerInterface';
import { PrismaClient } from '../../prisma/src/generated/client';
import jwt from 'jsonwebtoken';

type MyToken = {
    id: number
    email: string
    iat: number
    exp: number
}

class UserController implements ControllerInterface {

    public async profile(req: Request, res: Response): Promise<Response> {
        if (!req.headers.authorization) {
            return res.status(400).json({
                "message": "bearer not found !"
            });
        }

        let secret = process.env.JWT_SECRET || "secret";
        let token = req.headers.authorization.split(" ")[1];

        let payload = jwt.verify(token, secret) as MyToken;
        const prisma = new PrismaClient();

        const data = await prisma.user.findFirst({
            where: {
                id: payload.id
            }
        });

        return res.status(200).json({ data: {
            id: data?.id,
            name: data?.name,
            account: data?.account,
            email: data?.email
        } });
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();

        const body = await prisma.user.findMany()

        return res.status(200).json({ data: body });
    }
}

export default new UserController();