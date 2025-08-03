import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
   statusCode?: number;
   isOperational?: boolean;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
   let error = { ...err };
   error.message = err.message;

   // Log error
   console.error("Error:", err);

   // Mongoose bad ObjectId
   if (err.name === "CastError") {
      const message = "Recurso não encontrado";
      error = { name: "CastError", message, statusCode: 404 } as CustomError;
   }

   // Mongoose duplicate key
   if (err.name === "MongoError" && (err as any).code === 11000) {
      const message = "Recurso duplicado";
      error = { name: "MongoError", message, statusCode: 400 } as CustomError;
   }

   // Mongoose validation error
   if (err.name === "ValidationError") {
      const message = "Dados inválidos";
      error = { name: "ValidationError", message, statusCode: 400 } as CustomError;
   }

   res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Erro interno do servidor",
   });
};
