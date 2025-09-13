import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Paper, IconButton, CircularProgress, Alert } from "@mui/material";
import { Add, QrCode, Edit, CleaningServices, Restaurant, Visibility } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { setTables, addTable, updateTable, setLoading, setError } from "../../store/slices/tablesSlice";
import { tablesAPI } from "../../services/api";
import { Table } from "../../types";
import TableFormModal from "../../components/tables/TableFormModal";
import QRCodeModal from "../../components/tables/QRCodeModal";
import socketService from "../../services/socket";

const TablesPage: React.FC = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { tables, loading, error } = useSelector((state: RootState) => state.tables);
   const { token } = useSelector((state: RootState) => state.auth);
   const [qrModalOpen, setQrModalOpen] = useState(false);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [selectedTable, setSelectedTable] = useState<Table | null>(null);

   const fetchTables = useCallback(async () => {
      try {
         dispatch(setLoading(true));
         dispatch(setError(null));
         const tablesData = await tablesAPI.getTables();
         dispatch(setTables(tablesData));
      } catch (error: any) {
         if (error.response?.status === 429) {
            dispatch(setError("Muitas requisições. Aguarde um momento e tente novamente."));
         } else {
            dispatch(setError(error.message || "Erro ao carregar mesas"));
         }
      } finally {
         dispatch(setLoading(false));
      }
   }, [dispatch]);

   useEffect(() => {
      fetchTables();
   }, [fetchTables]);

   useEffect(() => {
      // Connect socket if authenticated
      if (token && !socketService.isConnected()) {
         socketService.connect(token);
      }

      // Set up socket listeners
      const handleTableStatusChanged = (data: { tableId: string; status: string }) => {
         dispatch(updateTable({ id: data.tableId, status: data.status } as Table));
      };

      const handleTableUpdated = (updatedTable: Table) => {
         dispatch(updateTable(updatedTable));
      };

      const handleTableCreated = (newTable: Table) => {
         dispatch(updateTable(newTable));
      };

      socketService.onTableStatusChanged(handleTableStatusChanged);
      socketService.onTableUpdated(handleTableUpdated);
      socketService.onTableCreated(handleTableCreated);

      return () => {
         // Clean up socket listeners when component unmounts
         socketService.offTableStatusChanged();
         socketService.offTableUpdated();
         socketService.offTableCreated();
      };
   }, [token, dispatch]);

   const handleStatusChange = async (table: Table, newStatus: Table["status"]) => {
      try {
         const updatedTable = await tablesAPI.updateTableStatus(table.id, newStatus, table.capacity);
         dispatch(updateTable(updatedTable));
      } catch (error: any) {
         if (error.response?.status === 429) {
            dispatch(setError("Muitas requisições. Aguarde um momento e tente novamente."));
         } else {
            dispatch(setError(error.message || "Erro ao atualizar status da mesa"));
         }
      }
   };

   const handleEditTable = (table: Table) => {
      setSelectedTable(table);
      setEditModalOpen(true);
   };

   const handleShowQR = (table: Table) => {
      setSelectedTable(table);
      setQrModalOpen(true);
   };

   const handleNewTable = () => {
      setSelectedTable(null);
      setEditModalOpen(true);
   };

   const handleTableSubmit = async (tableData: Omit<Table, "id" | "qrCode">) => {
      try {
         if (selectedTable) {
            // Check if status or capacity changed
            const statusChanged = selectedTable.status !== tableData.status;
            const capacityChanged = selectedTable.capacity !== tableData.capacity;
            
            if (statusChanged || capacityChanged) {
               const updatedTable = await tablesAPI.updateTableStatus(selectedTable.id, tableData.status, tableData.capacity);
               dispatch(updateTable(updatedTable));
            } else {
               // If nothing changed, show a message
               dispatch(setError("Nenhuma alteração foi feita na mesa."));
               return;
            }
            
            // Note: Number updates are not supported by the backend yet
            if (selectedTable.number !== tableData.number) {
               dispatch(setError("O número da mesa não pode ser alterado. Apenas status e capacidade foram atualizados."));
            }
         } else {
            // Create new table
            const newTable = await tablesAPI.createTable(tableData);
            dispatch(addTable(newTable));
         }
      } catch (error: any) {
         if (error.response?.status === 429) {
            dispatch(setError("Muitas requisições. Aguarde um momento e tente novamente."));
         } else {
            dispatch(setError(error.message || "Erro ao salvar mesa"));
         }
         throw error;
      }
   };

   const handleViewOrders = (table: Table) => {
      navigate(`/orders?table=${table.id}&tableNumber=${table.number}`);
   };

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

   if (loading) {
      return (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
         </Box>
      );
   }

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

            <Button variant="contained" startIcon={<Add />} onClick={handleNewTable}>
               Nova Mesa
            </Button>
         </Box>

         {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(setError(null))}>
               {error}
            </Alert>
         )}

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
                           <IconButton size="small" color="primary" onClick={() => handleShowQR(table)} title="Ver QR Code">
                              <QrCode />
                           </IconButton>
                           <IconButton size="small" color="info" onClick={() => handleEditTable(table)} title="Editar Mesa">
                              <Edit />
                           </IconButton>
                           {table.status === "OCUPADA" && (
                              <>
                                 <IconButton size="small" color="secondary" onClick={() => handleViewOrders(table)} title="Ver Pedidos">
                                    <Visibility />
                                 </IconButton>
                                 <IconButton size="small" color="success" onClick={() => handleStatusChange(table, "LIVRE")} title="Marcar como Livre">
                                    <Restaurant />
                                 </IconButton>
                              </>
                           )}
                           {table.status === "LIVRE" && (
                              <IconButton size="small" color="warning" onClick={() => handleStatusChange(table, "OCUPADA")} title="Marcar como Ocupada">
                                 <Restaurant />
                              </IconButton>
                           )}
                           {table.status === "MANUTENCAO" && (
                              <IconButton size="small" color="warning" onClick={() => handleStatusChange(table, "LIVRE")} title="Finalizar Manutenção">
                                 <CleaningServices />
                              </IconButton>
                           )}
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>

         <TableFormModal
            open={editModalOpen}
            table={selectedTable}
            existingTables={tables}
            onClose={() => setEditModalOpen(false)}
            onSubmit={handleTableSubmit}
         />

         <QRCodeModal
            open={qrModalOpen}
            table={selectedTable}
            onClose={() => setQrModalOpen(false)}
         />
      </Box>
   );
};

export default TablesPage;
