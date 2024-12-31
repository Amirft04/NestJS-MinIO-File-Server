import { HttpStatus } from '@nestjs/common';

export const successStore = (res: any, data?: any) => {
  return res.status(HttpStatus.OK).json({
    code: 200,
    data: data ? data : undefined,
    message: 'Successfully created',
    success: true,
  });
};

export const catchError = (res: any, error: string) => {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    code: 500,
    message: error,
    success: false,
  });
};

export const failedError = (res: any, message?: string) => {
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    code: 501,
    message: message ? message : 'An error occurred',
    success: false,
  });
};

export const existError = (res: any, key: string) => {
  return res.status(HttpStatus.CONFLICT).json({
    code: 400,
    message: `${key} already exists`,
    success: false,
  });
};

export const validationError = (res: any, error: string) => {
  return res.status(HttpStatus.BAD_REQUEST).json({
    code: 400,
    message: error,
    success: false,
  });
};

export const notFoundError = (res: any, error: string) => {
  return res.status(HttpStatus.NOT_FOUND).json({
    code: 400,
    message: error,
    success: false,
  });
};

export const successGetData = (res: any, data: any) => {
  return res.status(HttpStatus.OK).json({
    code: 200,
    data: data,
    success: true,
    message: 'Successfully retrieved',
  });
};

export const successUpdate = (res: any, data?: any) => {
  return res.status(HttpStatus.OK).json({
    code: 200,
    data: data ? data : undefined,
    message: 'Successfully updated',
    success: true,
  });
};

export const successDelete = (res: any) => {
  return res.status(HttpStatus.OK).json({
    code: 200,
    message: 'Successfully deleted',
    success: true,
  });
};
