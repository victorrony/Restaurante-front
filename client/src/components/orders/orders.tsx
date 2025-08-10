import React from "react";
import {
   Card,
   CardContent,
   Typography,
   Box,
   Chip,
   Divider,
   List,
   ListItem,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Button,
} from "@mui/material";
import { Kitchen, CheckCircle, Restaurant, TableBar } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export interface OrderItem {
   id: string;
   quantity: number;
   price: number;
   status: string;
   menuItem: { name: string; category?: { name: string } };
}

export interface GuestSelectionView {
   id: number;
   base: "ARROZ" | "SOPA";
   proteina: "CARNE" | "PEIXE";
   acompanhamento: "LEGUMES" | "SALADA";
   observacao?: string;
}

export interface OrderSummaryView {
   base?: Record<string, number>;
   proteina?: Record<string, number>;
   acompanhamento?: Record<string, number>;
   extrasCategoria?: Record<string, number>;
   extrasItens?: Record<string, number>;
}

export interface OrderData {
   id: string;
   orderNumber: string;
   status: string;
   totalAmount: number;
   table: { number: number };
   user: { name: string };
   createdAt: string;
   orderItems: OrderItem[];
   numberOfPeople?: number;
   guests?: GuestSelectionView[];
   summary?: OrderSummaryView;
   notes?: string;
}

interface Props {
   order: OrderData;
   onUpdateStatus: (orderId: string, status: string) => void;
   onUpdateItemStatus: (orderId: string, itemId: string, status: string) => void;
}

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

const isExtraCategory = (cat?: string) => ["BEBIDAS", "SOBREMESAS", "OUTROS"].includes((cat || "").toUpperCase());

const getTimeElapsed = (createdAt: string) => {
   const now = new Date();
   const created = new Date(createdAt);
   const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
   if (diffInMinutes < 60) return `${diffInMinutes} min`;
   const hours = Math.floor(diffInMinutes / 60);
   const minutes = diffInMinutes % 60;
   return `${hours}h ${minutes}m`;
};

const OrderCard: React.FC<Props> = ({ order, onUpdateStatus, onUpdateItemStatus }) => {
   const { user } = useSelector((s: RootState) => s.auth);
   const canUpdateOrders = user?.role === "COZINHEIRA" || user?.role === "ADMIN";

   // Separar itens principais vs extras (fallback se não houver categoria)
   const mainItems = order.orderItems.filter((i) => !isExtraCategory(i.menuItem.category?.name));
   const extraItems = order.orderItems.filter((i) => isExtraCategory(i.menuItem.category?.name));

   return (
      <Card
         sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            border: order.status === "PRONTO" ? "2px solid #10b981" : "1px solid #e5e7eb",
         }}
      >
         <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
               <Typography variant="h6" fontWeight="bold">
                  {order.orderNumber}
               </Typography>
               <Chip label={getStatusText(order.status)} color={getStatusColor(order.status) as any} size="small" />
            </Box>

            <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} mb={1}>
               <TableBar fontSize="small" color="action" />
               <Typography variant="body2" color="text.secondary">
                  Mesa {order.table.number}
               </Typography>
               <Typography variant="body2" color="text.secondary">
                  • {getTimeElapsed(order.createdAt)}
               </Typography>
               {order.numberOfPeople && (
                  <Chip
                     size="small"
                     label={`${order.numberOfPeople} pessoa${order.numberOfPeople > 1 ? "s" : ""}`}
                     variant="outlined"
                  />
               )}
            </Box>

            <Typography variant="body2" color="text.secondary" mb={1}>
               Atendente: {order.user.name}
            </Typography>

            {order.notes && (
               <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontStyle: "italic" }}>
                  Observações: {order.notes}
               </Typography>
            )}

            {/* Resumo agregado (se existir) */}
            {order.summary && (
               <Box mb={1} display="flex" flexWrap="wrap" gap={1}>
                  {order.summary.base &&
                     Object.entries(order.summary.base).map(
                        ([k, v]) => v > 0 && <Chip key={`b-${k}`} size="small" label={`${k}: ${v}`} />
                     )}
                  {order.summary.proteina &&
                     Object.entries(order.summary.proteina).map(
                        ([k, v]) => v > 0 && <Chip key={`p-${k}`} size="small" label={`${k}: ${v}`} />
                     )}
                  {order.summary.acompanhamento &&
                     Object.entries(order.summary.acompanhamento).map(
                        ([k, v]) => v > 0 && <Chip key={`a-${k}`} size="small" label={`${k}: ${v}`} />
                     )}
               </Box>
            )}

            {/* Convidados (detalhe por pessoa) */}
            {order.summary && (
               <Box mb={1} display="flex" flexDirection="column" gap={0.5}>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                     {order.summary.base &&
                        Object.entries(order.summary.base).map(
                           ([k, v]) => v > 0 && <Chip key={`b-${k}`} size="small" label={`${k}: ${v}`} />
                        )}
                     {order.summary.proteina &&
                        Object.entries(order.summary.proteina).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`p-${k}`}
                                    size="small"
                                    color="info"
                                    variant="outlined"
                                    label={`${k}: ${v}`}
                                 />
                              )
                        )}
                     {order.summary.acompanhamento &&
                        Object.entries(order.summary.acompanhamento).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`a-${k}`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    label={`${k}: ${v}`}
                                 />
                              )
                        )}
                     {order.summary.extrasCategoria &&
                        Object.entries(order.summary.extrasCategoria).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`ec-${k}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`${k}: ${v}`}
                                 />
                              )
                        )}
                  </Box>
                  {order.summary.extrasItens && Object.keys(order.summary.extrasItens).length > 0 && (
                     <Typography variant="caption" color="text.secondary">
                        Extras:{" "}
                        {Object.entries(order.summary.extrasItens)
                           .map(([nome, qtd]) => `${qtd}x ${nome}`)
                           .join(" • ")}
                     </Typography>
                  )}
               </Box>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Itens principais */}
            {mainItems.length > 0 && (
               <Box mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                     Pratos
                  </Typography>
                  <List dense>
                     {mainItems.map((item) => (
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
                                          onClick={() => onUpdateItemStatus(order.id, item.id, "EM_PREPARACAO")}
                                          color="primary"
                                       >
                                          <Kitchen />
                                       </IconButton>
                                    )}
                                    {item.status === "EM_PREPARACAO" && (
                                       <IconButton
                                          size="small"
                                          onClick={() => onUpdateItemStatus(order.id, item.id, "PRONTO")}
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
               </Box>
            )}

            {/* Extras */}
            {extraItems.length > 0 && (
               <Box mb={1}>
                  <Typography variant="subtitle2" fontWeight="bold">
                     Extras
                  </Typography>
                  <List dense>
                     {extraItems.map((item) => (
                        <ListItem key={item.id} sx={{ px: 0 }}>
                           <ListItemText
                              primary={`${item.quantity}x ${item.menuItem.name}`}
                              secondary={`R$ ${item.price.toFixed(2)}`}
                           />
                           <ListItemSecondaryAction>
                              {canUpdateOrders && order.status !== "SERVIDO" && (
                                 <Chip
                                    label={getStatusText(item.status)}
                                    color={getStatusColor(item.status) as any}
                                    size="small"
                                    variant="outlined"
                                 />
                              )}
                           </ListItemSecondaryAction>
                        </ListItem>
                     ))}
                  </List>
               </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" pt={1}>
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
                           onClick={() => onUpdateStatus(order.id, "EM_PREPARACAO")}
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
                           onClick={() => onUpdateStatus(order.id, "PRONTO")}
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
                           onClick={() => onUpdateStatus(order.id, "SERVIDO")}
                        >
                           Servir
                        </Button>
                     )}
                  </Box>
               )}
            </Box>
         </CardContent>
      </Card>
   );
};
// ...existing code...
export default OrderCard;
