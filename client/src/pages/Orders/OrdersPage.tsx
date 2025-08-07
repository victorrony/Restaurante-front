import React, { useState } from "react";
import {
   Box,
   Grid,
   Card,
   CardContent,
   Typography,
   Button,
   Chip,
   List,
   ListItem,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Paper,
   Divider,   
} from "@mui/material";
import { Add, Kitchen, CheckCircle, Restaurant, TableBar } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const OrdersPage: React.FC = () => {
   const [statusFilter, setStatusFilter] = useState("ALL");
   const [newOrderDialog, setNewOrderDialog] = useState(false);

   const { user } = useSelector((state: RootState) => state.auth);

   // Mock data para demonstração
   const mockOrders = [
      {
         id: "1",
         orderNumber: "PED001",
         status: "PENDENTE",
         totalAmount: 45.9,
         table: { number: 5 },
         user: { name: "Maria Silva" },
         createdAt: new Date().toISOString(),
         orderItems: [
            {
               id: "1",
               quantity: 2,
               price: 15.9,
               menuItem: { name: "Hambúrguer Clássico", category: { name: "Lanches" } },
               status: "PENDENTE",
            },
            {
               id: "2",
               quantity: 1,
               price: 14.1,
               menuItem: { name: "Batata Frita", category: { name: "Acompanhamentos" } },
               status: "PENDENTE",
            },
         ],
      },
      {
         id: "2",
         orderNumber: "PED002",
         status: "EM_PREPARACAO",
         totalAmount: 62.5,
         table: { number: 2 },
         user: { name: "João Santos" },
         createdAt: new Date(Date.now() - 600000).toISOString(),
         orderItems: [
            {
               id: "3",
               quantity: 1,
               price: 28.9,
               menuItem: { name: "Pizza Margherita", category: { name: "Pizzas" } },
               status: "EM_PREPARACAO",
            },
            {
               id: "4",
               quantity: 2,
               price: 16.8,
               menuItem: { name: "Refrigerante", category: { name: "Bebidas" } },
               status: "PRONTO",
            },
         ],
      },
      {
         id: "3",
         orderNumber: "PED003",
         status: "PRONTO",
         totalAmount: 89.2,
         table: { number: 8 },
         user: { name: "Ana Costa" },
         createdAt: new Date(Date.now() - 1200000).toISOString(),
         orderItems: [
            {
               id: "5",
               quantity: 2,
               price: 35.9,
               menuItem: { name: "Salmão Grelhado", category: { name: "Peixes" } },
               status: "PRONTO",
            },
            {
               id: "6",
               quantity: 1,
               price: 17.4,
               menuItem: { name: "Salada Caesar", category: { name: "Saladas" } },
               status: "PRONTO",
            },
         ],
      },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case "PENDENTE":
            return "warning";
         case "EM_PREPARACAO":
            return "info";
         case "PRONTO":
            return "success";
         case "SERVIDO":
            return "default";
         case "CANCELADO":
            return "error";
         default:
            return "default";
      }
   };

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

   const getTimeElapsed = (createdAt: string) => {
      const now = new Date();
      const created = new Date(createdAt);
      const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);

      if (diffInMinutes < 60) {
         return `${diffInMinutes} min`;
      } else {
         const hours = Math.floor(diffInMinutes / 60);
         const minutes = diffInMinutes % 60;
         return `${hours}h ${minutes}m`;
      }
   };

   const handleUpdateStatus = (orderId: string, newStatus: string) => {
      // Aqui seria feita a chamada para a API
      console.log(`Atualizando pedido ${orderId} para status ${newStatus}`);
   };

   const handleUpdateItemStatus = (orderId: string, itemId: string, newStatus: string) => {
      // Aqui seria feita a chamada para a API
      console.log(`Atualizando item ${itemId} do pedido ${orderId} para status ${newStatus}`);
   };

   const filteredOrders =
      statusFilter === "ALL" ? mockOrders : mockOrders.filter((order) => order.status === statusFilter);

   const canUpdateOrders = user?.role === "COZINHEIRA" || user?.role === "ADMIN";
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

         <Grid container spacing={3}>
            {filteredOrders.map((order) => (
               <Grid item xs={12} md={6} lg={4} key={order.id}>
                  <Card
                     sx={{
                        height: "100%",
                        border: order.status === "PRONTO" ? "2px solid #10b981" : "1px solid #e5e7eb",
                     }}
                  >
                     <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                           <Typography variant="h6" fontWeight="bold">
                              {order.orderNumber}
                           </Typography>
                           <Chip
                              label={getStatusText(order.status)}
                              color={getStatusColor(order.status) as any}
                              size="small"
                           />
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                           <TableBar fontSize="small" color="action" />
                           <Typography variant="body2" color="text.secondary">
                              Mesa {order.table.number}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              • {getTimeElapsed(order.createdAt)}
                           </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                           Atendente: {order.user.name}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <List dense>
                           {order.orderItems.map((item) => (
                              <ListItem key={item.id} sx={{ px: 0 }}>
                                 <ListItemText
                                    primary={`${item.quantity}x ${item.menuItem.name}`}
                                    secondary={`R$ ${item.price.toFixed(2)}`}
                                 />
                                 <ListItemSecondaryAction>
                                    {canUpdateOrders && order.status !== "SERVIDO" && (
                                       <Box display="flex" alignItems="center" gap={1}>
                                          <Chip
                                             label={getStatusText(item.status)}
                                             color={getStatusColor(item.status) as any}
                                             size="small"
                                             variant="outlined"
                                          />
                                          {item.status === "PENDENTE" && (
                                             <IconButton
                                                size="small"
                                                onClick={() =>
                                                   handleUpdateItemStatus(order.id, item.id, "EM_PREPARACAO")
                                                }
                                                color="primary"
                                             >
                                                <Kitchen />
                                             </IconButton>
                                          )}
                                          {item.status === "EM_PREPARACAO" && (
                                             <IconButton
                                                size="small"
                                                onClick={() => handleUpdateItemStatus(order.id, item.id, "PRONTO")}
                                                color="success"
                                             >
                                                <CheckCircle />
                                             </IconButton>
                                          )}
                                       </Box>
                                    )}
                                 </ListItemSecondaryAction>
                              </ListItem>
                           ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                           <Typography variant="h6" fontWeight="bold">
                              Total: R$ {order.totalAmount.toFixed(2)}
                           </Typography>

                           {canUpdateOrders && order.status !== "SERVIDO" && (
                              <Box display="flex" gap={1}>
                                 {order.status === "PENDENTE" && (
                                    <Button
                                       size="small"
                                       variant="outlined"
                                       startIcon={<Kitchen />}
                                       onClick={() => handleUpdateStatus(order.id, "EM_PREPARACAO")}
                                    >
                                       Iniciar
                                    </Button>
                                 )}
                                 {order.status === "EM_PREPARACAO" && (
                                    <Button
                                       size="small"
                                       variant="contained"
                                       color="success"
                                       startIcon={<CheckCircle />}
                                       onClick={() => handleUpdateStatus(order.id, "PRONTO")}
                                    >
                                       Finalizar
                                    </Button>
                                 )}
                                 {order.status === "PRONTO" && user?.role !== "COZINHEIRA" && (
                                    <Button
                                       size="small"
                                       variant="contained"
                                       color="primary"
                                       startIcon={<Restaurant />}
                                       onClick={() => handleUpdateStatus(order.id, "SERVIDO")}
                                    >
                                       Servir
                                    </Button>
                                 )}
                              </Box>
                           )}
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>

         {filteredOrders.length === 0 && (
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
         <Dialog open={newOrderDialog} onClose={() => setNewOrderDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Novo Pedido</DialogTitle>
            <DialogContent>
               <Typography variant="body2" color="text.secondary">
                  Funcionalidade de criação de pedidos será implementada aqui.
               </Typography>
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setNewOrderDialog(false)}>Cancelar</Button>
               <Button variant="contained" onClick={() => setNewOrderDialog(false)}>
                  Criar Pedido
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
};

export default OrdersPage;
