import axios, { AxiosResponse } from "axios";
import {
   LoginRequest,
   LoginResponse,
   User,
   MenuItem,
   Category,
   Order,
   CreateOrderRequest,
   UpdateOrderStatusRequest,
   Table,
   Reservation,
   Ingredient,
   Feedback,
} from "../types";

// Configuração base do axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://restaurante-back-production.up.railway.app';

const api = axios.create({
   baseURL: API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
});

//
// Interceptor para adicionar token
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Interceptor para lidar com respostas
api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem("token");
         window.location.href = "/login";
      }
      return Promise.reject(error);
   }
);

// Auth API
export const authAPI = {
   login: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response: AxiosResponse<LoginResponse> = await api.post("/auth/login", credentials);
      return response.data;
   },

   register: async (userData: Omit<User, "id" | "createdAt" | "active"> & { password: string }): Promise<User> => {
      const response: AxiosResponse<{ user: User }> = await api.post("/auth/register", userData);
      return response.data.user;
   },

   getCurrentUser: async (): Promise<User> => {
      const response: AxiosResponse<User> = await api.get("/auth/me");
      return response.data;
   },
};

// Menu API
export const menuAPI = {
   getMenuItems: async (options?: { includeAll?: boolean }): Promise<MenuItem[]> => {
      const response: AxiosResponse<MenuItem[]> = await api.get("/menu", {
         params: options?.includeAll ? { includeAll: true } : undefined,
      });
      return response.data;
   },

   getCategories: async (): Promise<Category[]> => {
      const response: AxiosResponse<Category[]> = await api.get("/menu/categories");
      return response.data;
   },

   createCategory: async (data: { name: string; description?: string; order?: number }): Promise<Category> => {
      const response: AxiosResponse<Category> = await api.post("/menu/categories", data);
      return response.data;
   },

   createMenuItem: async (item: Omit<MenuItem, "id" | "category">): Promise<MenuItem> => {
      const response: AxiosResponse<MenuItem> = await api.post("/menu", item);
      return response.data;
   },

   updateMenuItem: async (id: string, item: Partial<MenuItem>): Promise<MenuItem> => {
      const response: AxiosResponse<MenuItem> = await api.put(`/menu/${id}`, item);
      return response.data;
   },

   deleteMenuItem: async (id: string): Promise<void> => {
      await api.delete(`/menu/${id}`);
   },
};

// Orders API
export const ordersAPI = {
   getOrders: async (params?: { status?: string; tableId?: string }): Promise<Order[]> => {
      const response: AxiosResponse<Order[]> = await api.get("/orders", { params });
      return response.data;
   },

   createOrder: async (order: CreateOrderRequest): Promise<Order> => {
      const response: AxiosResponse<Order> = await api.post("/orders", order);
      return response.data;
   },

   updateOrderStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
      const response: AxiosResponse<Order> = await api.put(`/orders/${id}/status`, data);
      return response.data;
   },

   updateOrderItemStatus: async (orderId: string, itemId: string, data: UpdateOrderStatusRequest): Promise<any> => {
      const response: AxiosResponse<any> = await api.put(`/orders/${orderId}/item/${itemId}/status`, data);
      return response.data;
   },
};

// Tables API
export const tablesAPI = {
   getTables: async (): Promise<Table[]> => {
      const response: AxiosResponse<Table[]> = await api.get("/tables");
      return response.data;
   },

   createTable: async (table: Omit<Table, "id" | "qrCode">): Promise<Table> => {
      const response: AxiosResponse<Table> = await api.post("/tables", table);
      return response.data;
   },

   updateTableStatus: async (id: string, status: Table["status"]): Promise<Table> => {
      const response: AxiosResponse<Table> = await api.put(`/tables/${id}/status`, { status });
      return response.data;
   },

   getTableQR: async (number: number): Promise<{ qrCode: string }> => {
      const response: AxiosResponse<{ qrCode: string }> = await api.get(`/tables/${number}/qr`);
      return response.data;
   },
};

// Reservations API
export const reservationsAPI = {
   getReservations: async (params?: { date?: string; status?: string }): Promise<Reservation[]> => {
      const response: AxiosResponse<Reservation[]> = await api.get("/reservations", { params });
      return response.data;
   },

   createReservation: async (reservation: Omit<Reservation, "id" | "createdAt" | "user">): Promise<Reservation> => {
      const response: AxiosResponse<Reservation> = await api.post("/reservations", reservation);
      return response.data;
   },

   updateReservationStatus: async (id: string, status: Reservation["status"]): Promise<Reservation> => {
      const response: AxiosResponse<Reservation> = await api.put(`/reservations/${id}/status`, { status });
      return response.data;
   },

   checkAvailability: async (params: { date: string; time: string; guests: number }): Promise<Table[]> => {
      const response: AxiosResponse<Table[]> = await api.get("/reservations/availability", { params });
      return response.data;
   },
};

// Inventory API
export const inventoryAPI = {
   getIngredients: async (): Promise<{
      ingredients: Ingredient[];
      lowStockCount: number;
      lowStockIngredients: Ingredient[];
   }> => {
      const response = await api.get("/inventory");
      return response.data;
   },

   createIngredient: async (ingredient: Omit<Ingredient, "id">): Promise<Ingredient> => {
      const response: AxiosResponse<Ingredient> = await api.post("/inventory", ingredient);
      return response.data;
   },

   updateIngredient: async (id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> => {
      const response: AxiosResponse<Ingredient> = await api.put(`/inventory/${id}`, ingredient);
      return response.data;
   },

   updateStock: async (id: string, data: { quantity: number; operation: "add" | "subtract" }): Promise<Ingredient> => {
      const response: AxiosResponse<Ingredient> = await api.put(`/inventory/${id}/stock`, data);
      return response.data;
   },

   getLowStock: async (): Promise<Ingredient[]> => {
      const response: AxiosResponse<Ingredient[]> = await api.get("/inventory/low-stock");
      return response.data;
   },
};

// Feedback API
export const feedbackAPI = {
   getFeedbacks: async (): Promise<{ feedbacks: Feedback[]; statistics: any }> => {
      const response = await api.get("/feedback");
      return response.data;
   },

   createFeedback: async (feedback: Omit<Feedback, "id" | "createdAt" | "user">): Promise<Feedback> => {
      const response: AxiosResponse<Feedback> = await api.post("/feedback", feedback);
      return response.data;
   },

   getStatistics: async (period?: string): Promise<any> => {
      const response = await api.get("/feedback/statistics", { params: { period } });
      return response.data;
   },
};

// Reports API
export const reportsAPI = {
   getSalesReport: async (params: { startDate?: string; endDate?: string; period?: string }): Promise<any> => {
      const response = await api.get("/reports/sales", { params });
      return response.data;
   },

   getPerformanceReport: async (date?: string): Promise<any> => {
      const response = await api.get("/reports/performance", { params: { date } });
      return response.data;
   },

   getInventoryReport: async (): Promise<any> => {
      const response = await api.get("/reports/inventory");
      return response.data;
   },
};

// Users API
export const usersAPI = {
   getUsers: async (): Promise<User[]> => {
      const response: AxiosResponse<User[]> = await api.get("/users");
      return response.data;
   },

   updateUser: async (id: string, user: Partial<User>): Promise<User> => {
      const response: AxiosResponse<User> = await api.put(`/users/${id}`, user);
      return response.data;
   },

   deleteUser: async (id: string): Promise<void> => {
      await api.delete(`/users/${id}`);
   },
};

export default api;
