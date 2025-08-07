import React from "react";
import {
   Box,
   Typography,
   Grid,
   Card,
   CardContent,
   Button,
   List,
   ListItem,
   ListItemText,
   ListItemIcon,
   Chip,
   LinearProgress,
   Alert,
   Paper,
   IconButton,
} from "@mui/material";
import { Add, Warning, Inventory, TrendingDown, Edit, LocalDining } from "@mui/icons-material";

const InventoryPage: React.FC = () => {
   // Mock data para demonstração
   const ingredients = [
      {
         id: "1",
         name: "Carne Bovina",
         unit: "kg",
         stockQty: 15.5,
         minStockQty: 10,
         cost: 35.9,
         status: "normal",
      },
      {
         id: "2",
         name: "Queijo Mozzarella",
         unit: "kg",
         stockQty: 3.2,
         minStockQty: 5,
         cost: 28.5,
         status: "low",
      },
      {
         id: "3",
         name: "Tomate",
         unit: "kg",
         stockQty: 8.7,
         minStockQty: 8,
         cost: 4.2,
         status: "normal",
      },
      {
         id: "4",
         name: "Alface",
         unit: "unidades",
         stockQty: 12,
         minStockQty: 15,
         cost: 2.8,
         status: "low",
      },
      {
         id: "5",
         name: "Salmão",
         unit: "kg",
         stockQty: 0.5,
         minStockQty: 3,
         cost: 89.9,
         status: "critical",
      },
   ];

   const lowStockIngredients = ingredients.filter((ing) => ing.stockQty <= ing.minStockQty);
   const criticalStock = ingredients.filter((ing) => ing.stockQty <= ing.minStockQty * 0.5);

   const getStockStatus = (current: number, minimum: number) => {
      const percentage = (current / minimum) * 100;
      if (percentage <= 50) return "critical";
      if (percentage <= 100) return "low";
      return "normal";
   };

   const getStockColor = (status: string) => {
      switch (status) {
         case "critical":
            return "error";
         case "low":
            return "warning";
         case "normal":
            return "success";
         default:
            return "default";
      }
   };

   const getStockPercentage = (current: number, minimum: number) => {
      return Math.min((current / minimum) * 100, 100);
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Estoque
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Controle de ingredientes e insumos
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Add />}>
               Novo Ingrediente
            </Button>
         </Box>

         {/* Alertas */}
         {criticalStock.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
               <Typography variant="subtitle2" fontWeight="bold">
                  Estoque Crítico!
               </Typography>
               <Typography variant="body2">
                  {criticalStock.length} ingrediente(s) com estoque crítico:{" "}
                  {criticalStock.map((ing) => ing.name).join(", ")}
               </Typography>
            </Alert>
         )}

         {lowStockIngredients.length > 0 && criticalStock.length === 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
               <Typography variant="subtitle2" fontWeight="bold">
                  Estoque Baixo
               </Typography>
               <Typography variant="body2">{lowStockIngredients.length} ingrediente(s) com estoque baixo</Typography>
            </Alert>
         )}

         {/* Estatísticas */}
         <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                     {ingredients.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Total de Itens
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                     {criticalStock.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Estoque Crítico
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                     {lowStockIngredients.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Estoque Baixo
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                     R$ {ingredients.reduce((sum, ing) => sum + ing.stockQty * ing.cost, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Valor Total
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         {/* Lista de Ingredientes */}
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <Card>
                  <CardContent>
                     <Typography variant="h6" gutterBottom fontWeight="bold">
                        📦 Ingredientes em Estoque
                     </Typography>

                     <List>
                        {ingredients.map((ingredient) => {
                           const status = getStockStatus(ingredient.stockQty, ingredient.minStockQty);
                           const percentage = getStockPercentage(ingredient.stockQty, ingredient.minStockQty);

                           return (
                              <ListItem key={ingredient.id} divider>
                                 <ListItemIcon>
                                    {status === "critical" ? (
                                       <Warning color="error" />
                                    ) : status === "low" ? (
                                       <TrendingDown color="warning" />
                                    ) : (
                                       <Inventory color="success" />
                                    )}
                                 </ListItemIcon>

                                 <ListItemText
                                    primary={
                                       <Box display="flex" alignItems="center" justifyContent="space-between">
                                          <Typography variant="subtitle1" fontWeight="medium">
                                             {ingredient.name}
                                          </Typography>
                                          <Chip
                                             label={
                                                status === "critical"
                                                   ? "Crítico"
                                                   : status === "low"
                                                   ? "Baixo"
                                                   : "Normal"
                                             }
                                             color={getStockColor(status) as any}
                                             size="small"
                                          />
                                       </Box>
                                    }
                                    secondary={
                                       <Box>
                                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                             <Typography variant="body2" color="text.secondary">
                                                Estoque: {ingredient.stockQty} {ingredient.unit}
                                             </Typography>
                                             <Typography variant="body2" color="text.secondary">
                                                Mínimo: {ingredient.minStockQty} {ingredient.unit}
                                             </Typography>
                                             <Typography variant="body2" color="text.secondary">
                                                Custo: R$ {ingredient.cost.toFixed(2)}/{ingredient.unit}
                                             </Typography>
                                          </Box>
                                          <LinearProgress
                                             variant="determinate"
                                             value={percentage}
                                             color={getStockColor(status) as any}
                                             sx={{ height: 6, borderRadius: 3 }}
                                          />
                                       </Box>
                                    }
                                 />

                                 <Box display="flex" flexDirection="column" alignItems="center" gap={1} ml={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                       R$ {(ingredient.stockQty * ingredient.cost).toFixed(2)}
                                    </Typography>
                                    <Box>
                                       <IconButton size="small" color="primary">
                                          <LocalDining />
                                       </IconButton>
                                       <IconButton size="small" color="info">
                                          <Edit />
                                       </IconButton>
                                    </Box>
                                 </Box>
                              </ListItem>
                           );
                        })}
                     </List>
                  </CardContent>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
};

export default InventoryPage;
