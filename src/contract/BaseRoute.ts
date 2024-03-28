import express, { Router } from 'express';
import RouteInterface from './RouteInterface';

abstract class BaseRoutes implements RouteInterface{
    public router :Router;
    constructor(){
        this.router = Router();
        this.routes();
    }

    abstract routes():void;
}

export default BaseRoutes;