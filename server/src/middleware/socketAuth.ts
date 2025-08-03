import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

interface SocketWithUser extends Socket {
   user?: any;
}

export const socketAuth = (socket: SocketWithUser, next: (err?: Error) => void) => {
   try {
      const token = socket.handshake.auth.token;

      if (!token) {
         return next(new Error("Token não fornecido"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      socket.user = decoded;
      next();
   } catch (error) {
      next(new Error("Token inválido"));
   }
};
