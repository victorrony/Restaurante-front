export interface User {
   id: string;
   email: string;
   name: string;
   role: "ADMIN" | "RECEPCIONISTA" | "COZINHEIRA";
   active: boolean;
   createdAt: string;
}

export interface AuthState {
   isAuthenticated: boolean;
   user: User | null;
   token: string | null;
   loading: boolean;
   error: string | null;
}

export interface MenuItem {
   id: string;
   name: string;
   description?: string;
   price: number;
   image?: string;
   available: boolean;
   preparationTime?: number;
   categoryId: string;
   category: Category;
   // Flags vindos do backend para montagem/agrupamento
   isBase?: boolean;
   isProteina?: boolean;
   isAcompanhamento?: boolean;
   isBebida?: boolean;
   isPratoDoDia?: boolean;
   isSobremesa?: boolean;
}

export interface Category {
   id: string;
   name: string;
   description?: string;
   active: boolean;
   order?: number;
}

export interface Table {
   id: string;
   number: number;
   capacity: number;
   status: "LIVRE" | "OCUPADA" | "RESERVADA" | "MANUTENCAO";
   qrCode?: string;
}

export interface Order {
   id: string;
   orderNumber: string;
   status: "PENDENTE" | "EM_PREPARACAO" | "PRONTO" | "SERVIDO" | "CANCELADO";
   totalAmount: number;
   notes?: string;
   createdAt: string;
   updatedAt: string;
   tableId: string;
   table: Table;
   userId: string;
   user: Pick<User, "name" | "email">;
   orderItems: OrderItem[];
}

export interface OrderItem {
   id: string;
   quantity: number;
   price: number;
   notes?: string;
   status: "PENDENTE" | "EM_PREPARACAO" | "PRONTO" | "SERVIDO" | "CANCELADO";
   orderId: string;
   menuItemId: string;
   menuItem: MenuItem;
}

export interface Reservation {
   id: string;
   date: string;
   time: string;
   guests: number;
   customerName: string;
   customerPhone: string;
   customerEmail?: string;
   status: "CONFIRMADA" | "CANCELADA" | "FINALIZADA";
   notes?: string;
   createdAt: string;
   tableId: string;
   table: Table;
   userId?: string;
   user?: Pick<User, "name" | "email">;
}

export interface Ingredient {
   id: string;
   name: string;
   unit: string;
   stockQty: number;
   minStockQty: number;
   cost: number;
}

export interface Feedback {
   id: string;
   rating: number;
   comment?: string;
   serviceRating?: number;
   foodRating?: number;
   createdAt: string;
   userId?: string;
   user?: Pick<User, "name" | "email">;
}

export interface ApiResponse<T> {
   data?: T;
   message?: string;
   error?: string;
   success: boolean;
}

export interface LoginRequest {
   email: string;
   password: string;
}

export interface LoginResponse {
   token: string;
   user: User;
}

export interface CreateOrderRequest {
   tableId: string;
   items: {
      menuItemId: string;
      quantity: number;
      price: number;
      notes?: string;
   }[];
   notes?: string;
}

export interface UpdateOrderStatusRequest {
   status: "PENDENTE" | "EM_PREPARACAO" | "PRONTO" | "SERVIDO" | "CANCELADO";
}
