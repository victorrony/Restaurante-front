import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import OrderCard from "../../components/orders/orders";
import NewOrderDialog from "../../components/orders/NewOrderDialog";
import { ordersAPI, tablesAPI } from "../../services/api";
import { setOrders, setLoading, setError, addOrder, updateOrder } from "../../store/slices/ordersSlice";
import { CreateOrderRequest, Order } from "../../types";

const OrdersPage: React.FC = () => {
   const [statusFilter, setStatusFilter] = useState("ALL");
   const [newOrderDialog, setNewOrderDialog] = useState(false);
   const [tables, setTables] = useState<{ id: string; number: number }[]>([]);
   const [creatingOrder, setCreatingOrder] = useState(false);
   const dispatch = useDispatch<AppDispatch>();

   const { user } = useSelector((state: RootState) => state.auth);
   const { orders, loading, error } = useSelector((s: RootState) => s.orders);

   // Carregar pedidos ao montar
   useEffect(() => {
      const load = async () => {
         dispatch(setLoading(true));
         dispatch(setError(null));
         try {
            const [ordersData, tablesData] = await Promise.all([
               ordersAPI.getOrders(),
               tablesAPI.getTables().catch(() => []),
            ]);
            dispatch(setOrders(ordersData));
            setTables(tablesData.map((t: any) => ({ id: t.id, number: t.number })));
         } catch (e: any) {
            dispatch(setError(e?.response?.data?.error || e.message || "Erro ao carregar pedidos"));
         } finally {
            dispatch(setLoading(false));
         }
      };
      load();
   }, [dispatch]);

   const getStatusText = (status: string) => {
      switch (status) {
         case "PENDENTE":
            return "Pendente";
         case "EM_PREPARACAO":
            return "Em Preparação";
         case "PRONTO":
            return "Pronto";
         case "SERVIDO":
            return "Servido";
         case "CANCELADO":
            return "Cancelado";
         default:
            return status;
      }
   };

   const handleUpdateStatus = async (orderId: string, newStatus: string) => {
      try {
         const updated = await ordersAPI.updateOrderStatus(orderId, { status: newStatus as any });
         dispatch(updateOrder(updated as Order));
      } catch (e) {
         // Error handled silently for now
      }
   };

   const handleUpdateItemStatus = async (orderId: string, itemId: string, newStatus: string) => {
      try {
         await ordersAPI.updateOrderItemStatus(orderId, itemId, { status: newStatus as any });
         const refreshed = await ordersAPI.getOrders();
         dispatch(setOrders(refreshed));
      } catch (e) {
         // Error handled silently for now
      }
   };

   const filteredOrders = useMemo(() => {
      if (statusFilter === "ALL") return orders;
      return orders.filter((o) => o.status === statusFilter);
   }, [orders, statusFilter]);

   const canCreateOrders = user?.role === "RECEPCIONISTA" || user?.role === "ADMIN";

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Pedidos
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  {user?.role === "COZINHEIRA"
                     ? "Gerencie o preparo dos pedidos"
                     : "Acompanhe todos os pedidos do restaurante"}
               </Typography>
            </Box>

            <Box display="flex" gap={2}>
               <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Filtrar Status</InputLabel>
                  <Select value={statusFilter} label="Filtrar Status" onChange={(e) => setStatusFilter(e.target.value)}>
                     <MenuItem value="ALL">Todos</MenuItem>
                     <MenuItem value="PENDENTE">Pendente</MenuItem>
                     <MenuItem value="EM_PREPARACAO">Em Preparação</MenuItem>
                     <MenuItem value="PRONTO">Pronto</MenuItem>
                     <MenuItem value="SERVIDO">Servido</MenuItem>
                  </Select>
               </FormControl>

               {canCreateOrders && (
                  <Button variant="contained" startIcon={<Add />} onClick={() => setNewOrderDialog(true)}>
                     Novo Pedido
                  </Button>
               )}
            </Box>
         </Box>

         {error && (
            <Paper sx={{ p: 2, mb: 2, border: "1px solid", borderColor: "error.main" }}>
               <Typography color="error" variant="body2">
                  {error}
               </Typography>
            </Paper>
         )}
         <Grid container spacing={3}>
            {filteredOrders.map((order) => (
               <Grid item xs={12} sm={6} md={4} key={order.id}>
                  <OrderCard
                     order={order as any}
                     onUpdateStatus={handleUpdateStatus}
                     onUpdateItemStatus={handleUpdateItemStatus}
                  />
               </Grid>
            ))}
            {loading && (
               <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: "center" }}>
                     <Typography variant="body2" color="text.secondary">
                        Carregando pedidos...
                     </Typography>
                  </Paper>
               </Grid>
            )}
         </Grid>

         {!loading && filteredOrders.length === 0 && (
            <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
               <Typography variant="h6" color="text.secondary">
                  Nenhum pedido encontrado
               </Typography>
               <Typography variant="body2" color="text.secondary" mt={1}>
                  {statusFilter === "ALL"
                     ? "Não há pedidos no momento"
                     : `Não há pedidos com status "${getStatusText(statusFilter)}"`}
               </Typography>
            </Paper>
         )}

         {/* Dialog para novo pedido - implementação básica */}
         <NewOrderDialog
            open={newOrderDialog}
            onClose={() => setNewOrderDialog(false)}
            onCreate={async (data: any) => {
               console.log('🏪 OrdersPage onCreate received data:', data);
               if (creatingOrder) return;
               setCreatingOrder(true);
               try {
                  const table = tables.find((t) => t.number === Number(data.tableNumber));
                  if (!table) {
                     dispatch(setError("Mesa informada não encontrada"));
                     return;
                  }
                  // Montar payload compatível com API existente
                  // NewOrderDialog sends all items in data.items array
                  const items = (data.items || []).filter((item: any) => item.menuItemId).map((it: any) => ({
                     menuItemId: it.menuItemId,
                     quantity: it.quantity,
                     price: it.price,
                     notes: it.notes,
                  }));
                  console.log('🔄 Mapped items:', items);
                  if (items.length === 0) {
                     console.log('❌ No valid items mapped');
                     dispatch(setError("Nenhum item de menu válido mapeado para o pedido"));
                     return;
                  }
                  const payload: CreateOrderRequest = {
                     tableId: table.id,
                     items,
                     notes: data.notes,
                  };
                  console.log('🚀 Calling API with payload:', payload);
                  const created = await ordersAPI.createOrder(payload);
                  console.log('✅ API response:', created);
                  dispatch(addOrder(created as Order));
                  // Limpar erro de criação se sucesso
                  dispatch(setError(null));
               } catch (e: any) {
                  dispatch(setError(e?.response?.data?.message || e.message || "Falha ao criar pedido"));
               } finally {
                  setCreatingOrder(false);
                  setNewOrderDialog(false);
               }
            }}
         />
      </Box>
   );
};

export default OrdersPage;
