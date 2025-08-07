import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Button, Fab, IconButton } from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";

const MenuPage: React.FC = () => {
   // Mock data para demonstração
   const menuItems = [
      {
         id: "1",
         name: "Hambúrguer Clássico",
         description: "Pão artesanal, carne 180g, queijo, alface, tomate",
         price: 24.9,
         image: "/api/placeholder/300/200",
         available: true,
         category: { name: "Lanches" },
         preparationTime: 15,
      },
      {
         id: "2",
         name: "Pizza Margherita",
         description: "Molho de tomate, mozzarella, manjericão fresco",
         price: 32.9,
         image: "/api/placeholder/300/200",
         available: true,
         category: { name: "Pizzas" },
         preparationTime: 20,
      },
      {
         id: "3",
         name: "Salmão Grelhado",
         description: "Salmão fresco grelhado com legumes da estação",
         price: 45.9,
         image: "/api/placeholder/300/200",
         available: false,
         category: { name: "Peixes" },
         preparationTime: 25,
      },
   ];

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Cardápio
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Gerencie os itens do menu do restaurante
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Add />}>
               Novo Item
            </Button>
         </Box>

         <Grid container spacing={3}>
            {menuItems.map((item) => (
               <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card sx={{ height: "100%" }}>
                     <CardMedia
                        component="div"
                        sx={{
                           height: 200,
                           backgroundColor: "#f5f5f5",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                     >
                        <Typography variant="body2" color="text.secondary">
                           Imagem do Prato
                        </Typography>
                     </CardMedia>
                     <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                           <Typography variant="h6" fontWeight="bold">
                              {item.name}
                           </Typography>
                           <Chip
                              label={item.available ? "Disponível" : "Indisponível"}
                              color={item.available ? "success" : "error"}
                              size="small"
                           />
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                           {item.description}
                        </Typography>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                           <Typography variant="h6" color="primary" fontWeight="bold">
                              R$ {item.price.toFixed(2)}
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              {item.preparationTime} min
                           </Typography>
                        </Box>

                        <Chip label={item.category.name} variant="outlined" size="small" sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between">
                           <IconButton size="small" color="primary">
                              <Visibility />
                           </IconButton>
                           <IconButton size="small" color="info">
                              <Edit />
                           </IconButton>
                           <IconButton size="small" color="error">
                              <Delete />
                           </IconButton>
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>

         <Fab color="primary" aria-label="add" sx={{ position: "fixed", bottom: 16, right: 16 }}>
            <Add />
         </Fab>
      </Box>
   );
};

export default MenuPage;
