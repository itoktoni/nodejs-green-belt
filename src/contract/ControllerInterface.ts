import { Request, Response } from "express";

interface RouteInterface{
    list(req: Request, res: Response): Promise<Response>;
}

export default RouteInterface;