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
   bebida?: Record<string, number>;
   sobremesa?: Record<string, number>;
   outro?: Record<string, number>;
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
   // Add extra safety check for orderItems array
   const orderItems = order.orderItems || [];
   const mainItems = orderItems.filter((i) => i.menuItem && !isExtraCategory(i.menuItem.category?.name));
   const extraItems = orderItems.filter((i) => i.menuItem && isExtraCategory(i.menuItem.category?.name));
   
   // Group items by customer for kitchen organization
   const groupItemsByCustomer = (items: any[]) => {
      const grouped: Record<string, any[]> = {};
      items.forEach(item => {
         // Extract customer number from notes (e.g., "Pessoa #1 - observação")
         const match = item.notes?.match(/Pessoa #(\d+)/);
         const customerKey = match ? `Pessoa ${match[1]}` : 'Geral';
         if (!grouped[customerKey]) {
            grouped[customerKey] = [];
         }
         grouped[customerKey].push(item);
      });
      return grouped;
   };

   const groupedMainItems = groupItemsByCustomer(mainItems);
   const groupedExtraItems = groupItemsByCustomer(extraItems);

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
                  Mesa {order.table?.number || "N/A"}
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
               Atendente: {order.user?.name || "N/A"}
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
                  {order.summary.bebida &&
                     Object.entries(order.summary.bebida).map(
                        ([k, v]) => v > 0 && <Chip key={`b-${k}`} size="small" label={`${k}: ${v}`} />
                     )}
                  {order.summary.sobremesa &&
                     Object.entries(order.summary.sobremesa).map(
                        ([k, v]) => v > 0 && <Chip key={`s-${k}`} size="small" label={`${k}: ${v}`} />
                     )}
                  {order.summary.outro &&
                     Object.entries(order.summary.outro).map(
                        ([k, v]) => v > 0 && <Chip key={`o-${k}`} size="small" label={`${k}: ${v}`} />
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
                     {order.summary.bebida &&
                        Object.entries(order.summary.bebida).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`b-${k}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`${k}: ${v}`}
                                 />
                              )
                        )}
                     {order.summary.sobremesa &&
                        Object.entries(order.summary.sobremesa).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`s-${k}`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    label={`${k}: ${v}`}
                                 />
                              )
                        )}
                     {order.summary.outro &&
                        Object.entries(order.summary.outro).map(
                           ([k, v]) =>
                              v > 0 && (
                                 <Chip
                                    key={`o-${k}`}
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

            {/* Itens principais agrupados por cliente */}
            <Box mb={1}>
               {Object.keys(groupedMainItems).length > 0 && (
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                     Pratos Principais
                  </Typography>
               )}
               <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                  {Object.entries(groupedMainItems).map(([customerKey, items]) => (
                     <Box key={customerKey} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, minWidth: 200 }}>
                        <Typography variant="body2" fontWeight="bold" color="primary" sx={{ mb: 0.5 }}>
                           {customerKey}
                        </Typography>
                        <List dense>
                           {items.map((item) => (
                              <ListItem key={item.id} sx={{ px: 0, py: 0.5 }}>
                                 <ListItemText
                                    primary={`${item.quantity}x ${item.menuItem?.name || "Item sem nome"}`}
                                    secondary={
                                       <Box display="flex" justifyContent="space-between" alignItems="center">
                                          <span>R$ {Number(item.price || 0).toFixed(2)}</span>
                                          {item.notes && item.notes.includes(' - ') && (
                                             <Typography variant="caption" sx={{ fontStyle: 'italic', ml: 1 }}>
                                                {item.notes.split(' - ').slice(1).join(' - ')}
                                             </Typography>
                                          )}
                                       </Box>
                                    }
                                 />
                                 <ListItemSecondaryAction>
                                    {canUpdateOrders && order.status !== "SERVIDO" && (
                                       <Box display="flex" alignItems="center" gap={0.5}>
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
                  ))}
               </Box>
            </Box>

            {/* Extras agrupados por cliente */}
            <Box mb={1}>
               {Object.keys(groupedExtraItems).length > 0 && (
                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                     Bebidas e Extras
                  </Typography>
               )}
               <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                  {Object.entries(groupedExtraItems).map(([customerKey, items]) => (
                     <Box key={customerKey} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, minWidth: 200, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="body2" fontWeight="bold" color="secondary" sx={{ mb: 0.5 }}>
                           {customerKey}
                        </Typography>
                        <List dense>
                           {items.map((item) => (
                              <ListItem key={item.id} sx={{ px: 0, py: 0.5 }}>
                                 <ListItemText
                                    primary={`${item.quantity}x ${item.menuItem?.name || "Item sem nome"}`}
                                    secondary={
                                       <Box display="flex" justifyContent="space-between" alignItems="center">
                                          <span>R$ {Number(item.price || 0).toFixed(2)}</span>
                                          {item.notes && item.notes.includes(' - ') && (
                                             <Typography variant="caption" sx={{ fontStyle: 'italic', ml: 1 }}>
                                                {item.notes.split(' - ').slice(1).join(' - ')}
                                             </Typography>
                                          )}
                                       </Box>
                                    }
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
                  ))}
               </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto" pt={1}>
               <Typography variant="h6" fontWeight="bold">
                  Total: R$ {Number(order.totalAmount || 0).toFixed(2)}
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
