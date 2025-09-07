import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

// Lightweight shape for displaying items in the grid without requiring full backend Category fields
export interface GridMenuItem {
   id: string;
   name: string;
   description?: string;
   price: number;
   available?: boolean;
   preparationTime?: number;
   category?: { name: string };
   image?: string;
}

export interface MenuItemsGridProps {
   items: GridMenuItem[];
   onView?: (item: GridMenuItem) => void;
   onEdit?: (item: GridMenuItem) => void;
   onDelete?: (item: GridMenuItem) => void;
}

const MenuItemsGrid: React.FC<MenuItemsGridProps> = ({ items, onView, onEdit, onDelete }) => {
   return (
      <Grid container spacing={5}>
         {items.map((item) => (
            <Grid item xs={12} sm={6} md={2.4} key={item.id}>
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
                     {item.description && (
                        <Typography variant="body2" color="text.secondary" mb={2}>
                           {item.description}
                        </Typography>
                     )}
                     <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                           R$ {item.price.toFixed(2)}
                        </Typography>
                        {item.preparationTime != null && (
                           <Typography variant="body2" color="text.secondary">
                              {item.preparationTime} min
                           </Typography>
                        )}
                     </Box>
                     {item.category?.name && (
                        <Chip label={item.category.name} variant="outlined" size="small" sx={{ mb: 2 }} />
                     )}
                     <Box display="flex" justifyContent="space-between">
                        <IconButton size="small" color="primary" onClick={() => onView?.(item)}>
                           <Visibility />
                        </IconButton>
                        <IconButton size="small" color="info" onClick={() => onEdit?.(item)}>
                           <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => onDelete?.(item)}>
                           <Delete />
                        </IconButton>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         ))}
      </Grid>
   );
};

export default MenuItemsGrid;
