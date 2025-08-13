import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Grid, Card, Button, Fab, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import MenuItemForm, { MenuItemFormValues } from "../../components/menu/MenuItemForm";
import { menuAPI } from "../../services/api";
import { MenuItem } from "../../types";
import MenuItemsGrid from "../../components/menu/MenuItemsGrid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const MenuPage: React.FC = () => {
   const [createOpen, setCreateOpen] = useState(false);
   const [creating, setCreating] = useState(false);
   const [formError, setFormError] = useState<string | null>(null);
   const [items, setItems] = useState<MenuItem[]>([]);
   const [loadingItems, setLoadingItems] = useState(false);
   const [itemsError, setItemsError] = useState<string | null>(null);

   const userRole = useSelector((s: RootState) => s.auth.user?.role);

   const loadItems = useCallback(async () => {
      try {
         setItemsError(null);
         setLoadingItems(true);
         const data = await menuAPI.getMenuItems(userRole === "ADMIN" ? { includeAll: true } : undefined);
         setItems(data);
      } catch (e: any) {
         setItemsError(e?.response?.data?.message || e.message || "Falha ao carregar cardápio");
      } finally {
         setLoadingItems(false);
      }
   }, [userRole]);

   useEffect(() => {
      loadItems();
   }, [loadItems]);

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

            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateOpen(true)}>
               Novo Item
            </Button>
         </Box>

         <Box mb={3}>
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} md={4} key="new-card">
                  <Card
                     onClick={() => setCreateOpen(true)}
                     sx={{
                        height: "100%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 2,
                        border: "2px dashed",
                        borderColor: "divider",
                        bgcolor: "grey.50",
                        transition: "all .2s",
                        "&:hover": { borderColor: "primary.main", bgcolor: "grey.100" },
                     }}
                  >
                     <Box textAlign="center" display="flex" flexDirection="column" gap={1}>
                        <Add color="primary" />
                        <Typography variant="body2" color="text.secondary" fontWeight="bold">
                           Novo Item do Cardápio
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                           Clique para adicionar
                        </Typography>
                     </Box>
                  </Card>
               </Grid>
            </Grid>
         </Box>
         {loadingItems ? (
            <Box display="flex" justifyContent="center" mt={4}>
               <CircularProgress size={32} />
            </Box>
         ) : itemsError ? (
            <Typography color="error" variant="body2">
               {itemsError}
            </Typography>
         ) : (
            <MenuItemsGrid
               items={items.map((i) => ({
                  id: i.id,
                  name: i.name,
                  description: i.description,
                  price: Number(i.price),
                  image: i.image,
                  available: i.available,
                  category: i.category ? { name: i.category.name } : undefined,
                  preparationTime: i.preparationTime,
               }))}
               onEdit={(item) => {
                  // TODO: abrir form de edição com item (preencher form com initialValues)
                  console.log("edit", item);
               }}
               onDelete={async (item) => {
                  if (!window.confirm(`Remover o item "${item.name}"?`)) return;
                  try {
                     await menuAPI.deleteMenuItem(item.id);
                     setItems((prev) => prev.filter((p) => p.id !== item.id));
                  } catch (e: any) {
                     console.error(e);
                  }
               }}
               onView={(item) => console.log("view", item)}
            />
         )}

         <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={() => setCreateOpen(true)}
         >
            <Add />
         </Fab>

         <MenuItemForm
            open={createOpen}
            loading={creating}
            error={formError}
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (vals: MenuItemFormValues) => {
               setFormError(null);
               setCreating(true);
               try {
                  const created = await menuAPI.createMenuItem({
                     name: vals.name.trim(),
                     description: vals.description || undefined,
                     price: Number(vals.price),
                     categoryId: vals.categoryId,
                     available: vals.available,
                     preparationTime: vals.preparationTime ? Number(vals.preparationTime) : undefined,
                     image: vals.image || undefined,
                     isBase: vals.isBase,
                     isProteina: vals.isProteina,
                     isAcompanhamento: vals.isAcompanhamento,
                     isBebida: vals.isBebida,
                  } as any);
                  setItems((prev) => [created, ...prev]);
                  setCreateOpen(false);
               } catch (e: any) {
                  setFormError(e?.response?.data?.message || e.message || "Erro ao criar item");
               } finally {
                  setCreating(false);
               }
            }}
         />
      </Box>
   );
};

export default MenuPage;
