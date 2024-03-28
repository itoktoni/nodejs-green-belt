import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req:Request, res:Response, next:NextFunction) => {

    if(!req.headers.authorization){
        return res.status(400).json({
            "message" : "bearer not found !"
        });
    }

    let secret = process.env.JWT_SECRET || "secret";
    let token = req.headers.authorization.split(" ")[1];

    try {
        let check = jwt.verify(token, secret);
        if(check) {
            next();
        } else {
            return res.status(400).json({
                "message" : "user not authorized !"
            });
        }

    } catch (error) {
        return res.status(400).json(error);
    }

}

export default auth;