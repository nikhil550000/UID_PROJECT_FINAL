
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiResponse } from '../types';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: error.errors?.map((err: any) => err.message).join(', ') || 'Invalid request data'
      };
      res.status(400).json(response);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid parameters',
        message: error.errors?.map((err: any) => err.message).join(', ') || 'Invalid parameters'
      };
      res.status(400).json(response);
    }
  };
};
