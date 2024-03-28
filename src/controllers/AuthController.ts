import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../prisma/src/generated/client';
import Password from '../utils/Password';

class AuthController {

  public async register(req: Request, res: Response): Promise<Response> {

    const prisma = new PrismaClient();
    const { name, email, password } = req.body

    const password_hash = await Password.hash(password);
    const account: string = Math.floor(100000000 + Math.random() * 900000000).toString();

    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (user) {
      return res.status(421).send({
        "message": "Email sudah Ada !",
        "code": 421
      });
    }

    const body = await prisma.user.create({
      data: {
        name: name,
        email,
        account : account,
        password: password_hash
      }
    })

    return res.json({ message: "User Register Successfully !", data: body });
  }

  public async login(req: Request, res: Response): Promise<Response> {

    const prisma = new PrismaClient();
    const { account, password } = req.body

    const data = await prisma.user.findFirst({
      where: {
        account
      }
    })

    if (!data) {
      return res.status(421).send({
        "message": "Data tidak ditemukan !",
      });
    }

    let compare = await Password.compare(password, data.password);
    if (!compare) {
      return res.send({
        "message": "Data tidak ditemukan !",
        "code": 400
      });
    }

    return res.send(Password.token(data.id, data.name, data.password));

  }
}

export default new AuthController();


