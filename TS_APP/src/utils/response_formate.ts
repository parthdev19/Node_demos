import { Response } from 'express';

export const successRes = async (res: Response, msg: string, data: any) => {
  return res.send({
    success: true,
    statuscode: 1,
    message: msg,
    data: data,
  });
};

export const errorRes = async (res: Response, msg: string) => {
  return res.send({
    success: false,
    statuscode: 0,
    message: msg,
  });
};

export const errorResSuccess = async (res: Response, msg: string, data: any) => {
  return res.send({
    success: false,
    statuscode: 0,
    message: msg,   
    data: data,
  });
};

export const authFailRes = async (res: Response, msg: string,) => {
  return res.status(401).json({
    success: false,
    statuscode: 101,
    message: msg,
  });
};