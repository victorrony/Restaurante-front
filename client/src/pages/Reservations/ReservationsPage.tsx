import React from "react";
import {
   Box,
   Typography,
   Grid,
   Card,
   CardContent,
   Button,
   Chip,
   List,
   ListItem,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Paper,
   Avatar,
} from "@mui/material";
import { Add, Edit, Delete, Phone, Email, Event, People, AccessTime } from "@mui/icons-material";

const ReservationsPage: React.FC = () => {
   // Mock data para demonstração
   const reservations = [
      {
         id: "1",
         customerName: "Carlos Silva",
         customerPhone: "(11) 99999-1111",
         customerEmail: "carlos@email.com",
         date: "2025-08-03",
         time: "19:30",
         guests: 4,
         status: "CONFIRMADA",
         table: { number: 5 },
         notes: "Aniversário - precisa de bolo",
      },
      {
         id: "2",
         customerName: "Ana Santos",
         customerPhone: "(11) 88888-2222",
         customerEmail: "ana@email.com",
         date: "2025-08-03",
         time: "20:00",
         guests: 2,
         status: "CONFIRMADA",
         table: { number: 2 },
         notes: null,
      },
      {
         id: "3",
         customerName: "Roberto Costa",
         customerPhone: "(11) 77777-3333",
         customerEmail: "roberto@email.com",
         date: "2025-08-04",
         time: "19:00",
         guests: 6,
         status: "CONFIRMADA",
         table: { number: 8 },
         notes: "Jantar de negócios",
      },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case "CONFIRMADA":
            return "success";
         case "CANCELADA":
            return "error";
         case "FINALIZADA":
            return "default";
         default:
            return "default";
      }
   };

   const getStatusText = (status: string) => {
      switch (status) {
         case "CONFIRMADA":
            return "Confirmada";
         case "CANCELADA":
            return "Cancelada";
         case "FINALIZADA":
            return "Finalizada";
         default:
            return status;
      }
   };

   const formatDate = (dateString: string) => {
      const date = new Date(dateString + "T00:00:00");
      return date.toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
      });
   };

   const isToday = (dateString: string) => {
      const today = new Date().toISOString().split("T")[0];
      return dateString === today;
   };

   const todayReservations = reservations.filter((r) => isToday(r.date));
   const upcomingReservations = reservations.filter((r) => !isToday(r.date));

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Reservas
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Gerencie as reservas do restaurante
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Add />}>
               Nova Reserva
            </Button>
         </Box>

         {/* Estatísticas */}
         <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                     {todayReservations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Reservas Hoje
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                     {upcomingReservations.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Próximas Reservas
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                     {todayReservations.reduce((sum, r) => sum + r.guests, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Pessoas Hoje
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         <Grid container spacing={3}>
            {/* Reservas de Hoje */}
            <Grid item xs={12} md={6}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                        📅 Reservas de Hoje
                     </Typography>

                     {todayReservations.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                           Nenhuma reserva para hoje
                        </Typography>
                     ) : (
                        <List>
                           {todayReservations.map((reservation) => (
                              <ListItem key={reservation.id} divider>
                                 <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                                    {reservation.customerName.charAt(0)}
                                 </Avatar>
                                 <ListItemText
                                    primary={reservation.customerName}
                                    secondary={
                                       <Box>
                                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                             <AccessTime fontSize="small" />
                                             <Typography variant="body2">{reservation.time}</Typography>
                                             <People fontSize="small" />
                                             <Typography variant="body2">{reservation.guests} pessoas</Typography>
                                          </Box>
                                          <Typography variant="body2" color="text.secondary">
                                             Mesa {reservation.table.number}
                                          </Typography>
                                          {reservation.notes && (
                                             <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                {reservation.notes}
                                             </Typography>
                                          )}
                                       </Box>
                                    }
                                 />
                                 <ListItemSecondaryAction>
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                       <Chip
                                          label={getStatusText(reservation.status)}
                                          color={getStatusColor(reservation.status) as any}
                                          size="small"
                                       />
                                       <Box>
                                          <IconButton size="small" color="primary">
                                             <Phone />
                                          </IconButton>
                                          <IconButton size="small" color="info">
                                             <Edit />
                                          </IconButton>
                                       </Box>
                                    </Box>
                                 </ListItemSecondaryAction>
                              </ListItem>
                           ))}
                        </List>
                     )}
                  </CardContent>
               </Card>
            </Grid>

            {/* Próximas Reservas */}
            <Grid item xs={12} md={6}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold" color="info.main">
                        🗓️ Próximas Reservas
                     </Typography>

                     {upcomingReservations.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                           Nenhuma reserva futura
                        </Typography>
                     ) : (
                        <List>
                           {upcomingReservations.map((reservation) => (
                              <ListItem key={reservation.id} divider>
                                 <Avatar sx={{ mr: 2, bgcolor: "info.main" }}>
                                    {reservation.customerName.charAt(0)}
                                 </Avatar>
                                 <ListItemText
                                    primary={reservation.customerName}
                                    secondary={
                                       <Box>
                                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                             <Event fontSize="small" />
                                             <Typography variant="body2">{formatDate(reservation.date)}</Typography>
                                             <AccessTime fontSize="small" />
                                             <Typography variant="body2">{reservation.time}</Typography>
                                          </Box>
                                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                             <People fontSize="small" />
                                             <Typography variant="body2">
                                                {reservation.guests} pessoas - Mesa {reservation.table.number}
                                             </Typography>
                                          </Box>
                                          {reservation.notes && (
                                             <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                {reservation.notes}
                                             </Typography>
                                          )}
                                       </Box>
                                    }
                                 />
                                 <ListItemSecondaryAction>
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                       <Chip
                                          label={getStatusText(reservation.status)}
                                          color={getStatusColor(reservation.status) as any}
                                          size="small"
                                       />
                                       <Box>
                                          <IconButton size="small" color="info">
                                             <Edit />
                                          </IconButton>
                                          <IconButton size="small" color="error">
                                             <Delete />
                                          </IconButton>
                                       </Box>
                                    </Box>
                                 </ListItemSecondaryAction>
                              </ListItem>
                           ))}
                        </List>
                     )}
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
};

export default ReservationsPage;
