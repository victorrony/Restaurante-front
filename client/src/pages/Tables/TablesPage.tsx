import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Paper, IconButton } from "@mui/material";
import { Add, QrCode, Edit, CleaningServices, Restaurant } from "@mui/icons-material";

const TablesPage: React.FC = () => {
   // Mock data para demonstração
   const tables = [
      { id: "1", number: 1, capacity: 2, status: "LIVRE" },
      { id: "2", number: 2, capacity: 4, status: "OCUPADA" },
      { id: "3", number: 3, capacity: 2, status: "LIVRE" },
      { id: "4", number: 4, capacity: 6, status: "RESERVADA" },
      { id: "5", number: 5, capacity: 4, status: "OCUPADA" },
      { id: "6", number: 6, capacity: 2, status: "LIVRE" },
      { id: "7", number: 7, capacity: 8, status: "MANUTENCAO" },
      { id: "8", number: 8, capacity: 4, status: "OCUPADA" },
   ];

   const getStatusColor = (status: string) => {
      switch (status) {
         case "LIVRE":
            return "success";
         case "OCUPADA":
            return "warning";
         case "RESERVADA":
            return "info";
         case "MANUTENCAO":
            return "error";
         default:
            return "default";
      }
   };

   const getStatusText = (status: string) => {
      switch (status) {
         case "LIVRE":
            return "Livre";
         case "OCUPADA":
            return "Ocupada";
         case "RESERVADA":
            return "Reservada";
         case "MANUTENCAO":
            return "Manutenção";
         default:
            return status;
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "LIVRE":
            return "✅";
         case "OCUPADA":
            return "🍽️";
         case "RESERVADA":
            return "📅";
         case "MANUTENCAO":
            return "🔧";
         default:
            return "❓";
      }
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Mesas
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Gerencie o status e ocupação das mesas
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Add />}>
               Nova Mesa
            </Button>
         </Box>

         {/* Resumo */}
         <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                     {tables.filter((t) => t.status === "LIVRE").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Livres
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                     {tables.filter((t) => t.status === "OCUPADA").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Ocupadas
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="info.main" fontWeight="bold">
                     {tables.filter((t) => t.status === "RESERVADA").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Reservadas
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                     {tables.filter((t) => t.status === "MANUTENCAO").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Manutenção
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         {/* Grid de Mesas */}
         <Grid container spacing={3}>
            {tables.map((table) => (
               <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
                  <Card
                     sx={{
                        height: "100%",
                        border: table.status === "OCUPADA" ? "2px solid #f59e0b" : "1px solid #e5e7eb",
                        backgroundColor: table.status === "LIVRE" ? "#f0fdf4" : "white",
                     }}
                  >
                     <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h2" sx={{ mb: 1 }}>
                           {getStatusIcon(table.status)}
                        </Typography>

                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                           Mesa {table.number}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                           Capacidade: {table.capacity} pessoas
                        </Typography>

                        <Chip
                           label={getStatusText(table.status)}
                           color={getStatusColor(table.status) as any}
                           sx={{ mb: 2 }}
                        />

                        <Box display="flex" justifyContent="center" gap={1}>
                           <IconButton size="small" color="primary">
                              <QrCode />
                           </IconButton>
                           <IconButton size="small" color="info">
                              <Edit />
                           </IconButton>
                           {table.status === "OCUPADA" && (
                              <IconButton size="small" color="success">
                                 <Restaurant />
                              </IconButton>
                           )}
                           {table.status === "MANUTENCAO" && (
                              <IconButton size="small" color="warning">
                                 <CleaningServices />
                              </IconButton>
                           )}
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </Box>
   );
};

export default TablesPage;
