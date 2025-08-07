import React, { useState } from "react";
import {
   Box,
   Typography,
   Grid,
   Card,
   CardContent,
   Button,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   Paper,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Chip,
} from "@mui/material";
import { Assessment, TrendingUp, Restaurant, People, AttachMoney, DateRange } from "@mui/icons-material";

const ReportsPage: React.FC = () => {
   const [reportPeriod, setReportPeriod] = useState("today");

   // Mock data para demonstração
   const salesData = {
      totalRevenue: 12450.8,
      totalOrders: 145,
      averageTicket: 85.9,
      topItems: [
         { name: "Pizza Margherita", quantity: 25, revenue: 625.0 },
         { name: "Hambúrguer Gourmet", quantity: 18, revenue: 540.0 },
         { name: "Salmão Grelhado", quantity: 12, revenue: 480.0 },
      ],
   };

   const performanceData = [
      { metric: "Tempo Médio de Preparo", value: "18 min", trend: "down", color: "success" },
      { metric: "Taxa de Satisfação", value: "94%", trend: "up", color: "success" },
      { metric: "Pedidos Cancelados", value: "3%", trend: "down", color: "success" },
      { metric: "Mesa Ocupação", value: "78%", trend: "up", color: "success" },
   ];

   const recentOrders = [
      { id: "001", table: "Mesa 5", items: 3, total: 125.5, status: "completed", time: "14:30" },
      { id: "002", table: "Mesa 2", items: 2, total: 89.9, status: "completed", time: "14:15" },
      { id: "003", table: "Mesa 8", items: 4, total: 198.7, status: "completed", time: "14:00" },
      { id: "004", table: "Mesa 1", items: 1, total: 45.0, status: "cancelled", time: "13:45" },
   ];

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Relatórios
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Análise de desempenho e vendas
               </Typography>
            </Box>

            <Box display="flex" gap={2}>
               <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Período</InputLabel>
                  <Select value={reportPeriod} label="Período" onChange={(e) => setReportPeriod(e.target.value)}>
                     <MenuItem value="today">Hoje</MenuItem>
                     <MenuItem value="week">Esta Semana</MenuItem>
                     <MenuItem value="month">Este Mês</MenuItem>
                     <MenuItem value="year">Este Ano</MenuItem>
                  </Select>
               </FormControl>

               <Button variant="contained" startIcon={<Assessment />}>
                  Exportar PDF
               </Button>
            </Box>
         </Box>

         {/* Resumo Financeiro */}
         <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
               <Card>
                  <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                           <Typography variant="h4" color="primary" fontWeight="bold">
                              R$ {salesData.totalRevenue.toFixed(2)}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              Receita Total
                           </Typography>
                        </Box>
                        <AttachMoney color="primary" sx={{ fontSize: 40 }} />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>

            <Grid item xs={12} sm={3}>
               <Card>
                  <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                           <Typography variant="h4" color="info.main" fontWeight="bold">
                              {salesData.totalOrders}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              Total de Pedidos
                           </Typography>
                        </Box>
                        <Restaurant color="info" sx={{ fontSize: 40 }} />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>

            <Grid item xs={12} sm={3}>
               <Card>
                  <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                           <Typography variant="h4" color="success.main" fontWeight="bold">
                              R$ {salesData.averageTicket.toFixed(2)}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              Ticket Médio
                           </Typography>
                        </Box>
                        <TrendingUp color="success" sx={{ fontSize: 40 }} />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>

            <Grid item xs={12} sm={3}>
               <Card>
                  <CardContent>
                     <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                           <Typography variant="h4" color="warning.main" fontWeight="bold">
                              67
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              Clientes Atendidos
                           </Typography>
                        </Box>
                        <People color="warning" sx={{ fontSize: 40 }} />
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>

         <Grid container spacing={3}>
            {/* Itens Mais Vendidos */}
            <Grid item xs={12} md={6}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold">
                        🏆 Itens Mais Vendidos
                     </Typography>

                     {salesData.topItems.map((item, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                           <Box>
                              <Typography variant="subtitle2" fontWeight="medium">
                                 {item.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                 {item.quantity} unidades
                              </Typography>
                           </Box>
                           <Typography variant="subtitle1" fontWeight="bold" color="primary">
                              R$ {item.revenue.toFixed(2)}
                           </Typography>
                        </Box>
                     ))}
                  </CardContent>
               </Card>
            </Grid>

            {/* Indicadores de Performance */}
            <Grid item xs={12} md={6}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold">
                        📊 Indicadores de Performance
                     </Typography>

                     {performanceData.map((metric, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                           <Typography variant="subtitle2">{metric.metric}</Typography>
                           <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                 {metric.value}
                              </Typography>
                              <Chip
                                 size="small"
                                 label={metric.trend === "up" ? "↑" : "↓"}
                                 color={metric.color as any}
                              />
                           </Box>
                        </Box>
                     ))}
                  </CardContent>
               </Card>
            </Grid>

            {/* Pedidos Recentes */}
            <Grid item xs={12}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold">
                        📋 Últimos Pedidos
                     </Typography>

                     <TableContainer component={Paper} variant="outlined">
                        <Table>
                           <TableHead>
                              <TableRow>
                                 <TableCell>ID</TableCell>
                                 <TableCell>Mesa</TableCell>
                                 <TableCell>Itens</TableCell>
                                 <TableCell>Total</TableCell>
                                 <TableCell>Status</TableCell>
                                 <TableCell>Horário</TableCell>
                              </TableRow>
                           </TableHead>
                           <TableBody>
                              {recentOrders.map((order) => (
                                 <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.table}</TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                       <Chip
                                          label={order.status === "completed" ? "Concluído" : "Cancelado"}
                                          color={order.status === "completed" ? "success" : "error"}
                                          size="small"
                                       />
                                    </TableCell>
                                    <TableCell>{order.time}</TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
};

export default ReportsPage;
