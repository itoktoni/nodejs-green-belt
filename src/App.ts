// src/index.ts
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import AuthRoutes from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import { config as dotenv } from 'dotenv';
import TransactionRoutes from './routes/TransactionRoutes';

class App{
  public system:Application;

  constructor(){
    this.system = express();
    this.plugins();
    this.routes();

    dotenv();
  }

  protected plugins(): void {
    this.system.use(bodyParser.json());
    this.system.use(morgan('dev'));
  }

  protected routes(): void{
    this.system.use('/api', AuthRoutes);
    this.system.use('/api/user/', UserRoutes);
    this.system.use('/api/transaction/', TransactionRoutes);
  }
}

export default new App();