import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Password {
    public static hash = (password:string) => {
        return bycrypt.hash(password, 10);
    }

    public static compare = (password:string , encrypt:string):Promise<boolean> => {
        let check = bycrypt.compare(password, encrypt);
        return check;
    }

    public static token = (id:number, username:string, password:string):String => {
        const secret = process.env.JWT_SECRET || "secret";
        const token = jwt.sign({
            id, username, password
        }, secret);

        return token;
    }
}

export default Password;