import supertest from 'supertest';
import App from '../src/App';
import { PrismaClient } from '@prisma/client';

const login = { "username": "itoktoni", "password": "123456789" };
const register = { "username": "itoktoni", "email": "itok.toni@gmail.com", "password": "123456789" };


describe("User Register", () => {

    beforeEach(async () => {

        const prisma = new PrismaClient();
        const test = await prisma.user.deleteMany({
            where: {
                username: "itoktoni"
            }
        })

    });

    it("should user can register successfully", () => {

        const result = supertest(App.system).post('/api/register')
            .send(register)
            .then((body) => {

                const expected = "User Register Successfully !";
                const message = body.body.message;
                expect(message).toEqual(expected);
            })
    });
});


describe("User Register validation", () => {

    beforeEach(async () => {

        const prisma = new PrismaClient();

        await prisma.user.deleteMany({
            where: {
                username: "itoktoni"
            }
        })

        const test = await prisma.user.create({
            "data": register
        })

    });

    it("should user got validation when username same", async () => {

        const expected = 'Username sudah Ada !';
        return supertest(App.system).post('/api/register')
            .send(register)
            .expect(421)
            .then((body) => {
                const message = body.body.message;
                expect(message).toEqual(expected)
            })
    });
});
