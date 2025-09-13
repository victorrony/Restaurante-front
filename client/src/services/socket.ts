import { io, Socket } from "socket.io-client";

class SocketService {
   private socket: Socket | null = null;
   private readonly url: string;

   constructor() {
      this.url = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";
   }

   connect(token: string): void {
      if (this.socket?.connected) return;
      
      // Don't create multiple socket instances
      if (this.socket && !this.socket.connected) {
         this.socket.connect();
         return;
      }

      this.socket = io(this.url, {
         auth: {
            token: token,
         },
         autoConnect: true,
      });

      this.socket.on("connect", () => {
         console.log("Socket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
         console.log("Socket disconnected");
      });

      this.socket.on("connect_error", (error) => {
         console.error("Socket connection error:", error);
      });
   }

   disconnect(): void {
      if (this.socket) {
         this.socket.disconnect();
         this.socket = null;
      }
   }

   isConnected(): boolean {
      return this.socket?.connected || false;
   }

   // Table events
   onTableStatusChanged(callback: (data: { tableId: string; status: string }) => void): void {
      this.socket?.on("table_status_changed", callback);
   }

   onTableUpdated(callback: (table: any) => void): void {
      this.socket?.on("table_updated", callback);
   }

   onTableCreated(callback: (table: any) => void): void {
      this.socket?.on("table_created", callback);
   }

   // Order events
   onOrderStatusChanged(callback: (data: any) => void): void {
      this.socket?.on("order_status_changed", callback);
   }

   onNewOrder(callback: (order: any) => void): void {
      this.socket?.on("new_order", callback);
   }

   // Remove listeners
   offTableStatusChanged(): void {
      this.socket?.off("table_status_changed");
   }

   offTableUpdated(): void {
      this.socket?.off("table_updated");
   }

   offTableCreated(): void {
      this.socket?.off("table_created");
   }

   offOrderStatusChanged(): void {
      this.socket?.off("order_status_changed");
   }

   offNewOrder(): void {
      this.socket?.off("new_order");
   }

   // Emit events
   joinTableRoom(tableId: string): void {
      this.socket?.emit("join_table", { tableId });
   }

   leaveTableRoom(tableId: string): void {
      this.socket?.emit("leave_table", { tableId });
   }
}

export default new SocketService();