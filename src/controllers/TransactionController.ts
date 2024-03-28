import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../prisma/src/generated/client';
var { Parser } = require('json2csv')

class TransactionController {

    public async deposit(req: Request, res: Response): Promise<Response> {
        const { account, deposit } = req.body;

        const prisma = new PrismaClient();

        const data = await prisma.user.findFirst({
            where: {
                account: String(account)
            }
        })

        if (!data) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        const balance: number = Number(data?.balance) + Number(deposit);

        const send = await prisma.user.update({
            where: {
                id: data?.id
            },
            data: {
                balance
            }
        })

        const transaction = await prisma.transaction.create({
            data: {
                name: "deposit",
                user: data.id,
                in: Number(deposit),
                out: 0,
                balance,
                date: new Date()
            }
        })

        return res.status(200).send("account deposit update");
    }

    public async withdraw(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();
        const { account, withdraw } = req.body;
        const data = await prisma.user.findFirst({
            where: {
                account: String(account)
            }
        });

        if (!data) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        const balance: number = Number(data?.balance) - Number(withdraw);

        const send = await prisma.user.update({
            where: {
                id: data?.id
            },
            data: {
                balance
            }
        })

        const transaction = await prisma.transaction.create({
            data: {
                name: "deposit",
                user: data.id,
                out: Number(withdraw),
                in: 0,
                balance,
                date: new Date()
            }
        })

        return res.status(200).send("account withdraw update");
    }

    public async transfer(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();
        const { from, to, value } = req.body;

        const dataFrom = await prisma.user.findFirst({
            where: {
                account: String(from)
            }
        });

        if (!dataFrom) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        if (dataFrom?.balance < value) {
            return res.status(421).send({
                "message": "Saldo kurang !",
                "code": 421
            });
        }

        const dataTo = await prisma.user.findFirst({
            where: {
                account: String(to)
            }
        });

        if (!dataTo) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        const balanceFrom: number = Number(dataFrom?.balance) - Number(value);
        const balanceTo: number = Number(dataTo?.balance) + Number(value);

        await prisma.user.update({
            where: {
                id: dataFrom?.id
            },
            data: {
                balance: balanceFrom
            }
        })

        await prisma.user.update({
            where: {
                id: dataTo?.id
            },
            data: {
                balance: balanceTo
            }
        })

        await prisma.transaction.create({
            data:
            {
                name: "transfer out",
                user: dataFrom.id,
                out: Number(value),
                in: 0,
                balance : balanceFrom,
                date : new Date()
            }
        })

        await prisma.transaction.create({
            data:
            {
                name: "transfer in",
                user: dataTo.id,
                in: Number(value),
                out: 0,
                balance: balanceTo,
                date: new Date()
            }
        })

        return res.status(200).send("transfer update");
    }

    public async history(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();

        console.log(req.params.account);

        const data = await prisma.user.findFirst({
            where: {
                account: String(req.params.account)
            }
        })

        if (!data) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        const body = await prisma.transaction.findMany({
            where: {
                user: Number(data.id)
            }
        })

        return res.status(200).json({ data: body });
    }

    public async download(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();

        console.log(req.params.account);

        const user = await prisma.user.findFirst({
            where: {
                account: String(req.params.account)
            }
        })

        if (!user) {
            return res.status(421).send({
                "message": "Data tidak ditemukan !",
                "code": 421
            });
        }

        const data = await prisma.transaction.findMany({
            where: {
                user: Number(user.id)
            }
        })

        const json2csv = new Parser(data)

        const csv = json2csv.parse(data);
        res.set('Content-Type', 'application/octet-stream');
        res.attachment('history.csv');
        return res.send(csv);
    }
}

export default new TransactionController();