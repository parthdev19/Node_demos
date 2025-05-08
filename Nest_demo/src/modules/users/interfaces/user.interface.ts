import { Request } from 'express';

export interface signInData {
  name: string;
  email: string;
  password?: string;
  token?: string;
}

export interface RequestUser {
  _id: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}
