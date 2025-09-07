import React, { useState, useEffect, useCallback } from "react";
import {
   Box,
   Typography,
   Button,
   CircularProgress,
   Stack,
   Snackbar,
   Alert,
   Tabs,
   Tab,
   Divider,
} from "@mui/material";
import MenuItemForm, { MenuItemFormValues } from "../../components/menu/MenuItemForm";
import { menuAPI } from "../../services/api";
import { MenuItem, Category } from "../../types";
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
   const [initialValues, setInitialValues] = useState<MenuItemFormValues | null>(null);
   const [isViewMode, setIsViewMode] = useState(false);
   const [categories, setCategories] = useState<Category[]>([]);
   const [loadingCategories, setLoadingCategories] = useState(false);
   const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
      open: false,
      message: "",
      severity: "success",
   });
   type TabKey = "todos" | "prato-do-dia" | "bebidas" | "proteinas" | "acompanhamentos" | "sobremesas" | "outros";
   const [tab, setTab] = useState<TabKey>("todos");

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

   const loadCategories = useCallback(async () => {
      try {
         setLoadingCategories(true);
         const cats = await menuAPI.getCategories();
         setCategories(cats);
      } catch (e: any) {
         setSnack({
            open: true,
            message: e?.response?.data?.message || e.message || "Falha ao carregar categorias",
            severity: "error",
         });
      } finally {
         setLoadingCategories(false);
      }
   }, []);

   // Helper function to create new item with preset category
   const createNewItem = (categoryId?: string) => {
      setIsViewMode(false);
      setInitialValues({
         name: "",
         description: "",
         price: "",
         categoryId: categoryId || "",
         available: true,
         preparationTime: "",
         image: "",
         isBase: false,
         isProteina: false,
         isAcompanhamento: false,
         isBebida: false,
      });
      setCreateOpen(true);
   };

   // Helper function to filter items by category
   const filterItemsByCategory = useCallback((items: MenuItem[]) => {
      const lower = (s?: string) => (s || "").toLowerCase();
      return {
         bebidas: items.filter((i) => i.isBebida || lower(i.category?.name).includes("bebida")),
         proteinas: items.filter((i) => i.isProteina || lower(i.category?.name).includes("prote")),
         acompanhamentos: items.filter((i) => i.isAcompanhamento || lower(i.category?.name).includes("acompanha")),
         pratoDoDia: items.filter((i) => i.isPratoDoDia || lower(i.category?.name).includes("prato do dia")),
         sobremesas: items.filter((i) => lower(i.category?.name).includes("sobremesas")),
         outros: items.filter((i) => lower(i.category?.name) === "outros"),
      };
   }, []);

   useEffect(() => {
      loadItems();
      loadCategories();
   }, [loadItems, loadCategories]);

   const ensurePresetCategory = async (name: string, description?: string) => {
      try {
         // existe?
         const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
         let target = existing;
         if (!existing) {
            const created = await menuAPI.createCategory({ name, description });
            setCategories((prev) => [...prev, created]);
            target = created;
            setSnack({ open: true, message: `Categoria "${name}" criada`, severity: "success" });
         }
         if (target) {
            // Ajustar toggles conforme tipo
            const toggles: Partial<MenuItemFormValues> = {};
            const lower = name.toLowerCase();
            if (lower.includes("bebida")) toggles.isBebida = true;
            if (lower.includes("prote")) toggles.isProteina = true;
            if (lower.includes("acompanha")) toggles.isAcompanhamento = true;
            if (lower.includes("prato do dia")) toggles.isBase = true;

            // Switch to corresponding tab
            if (lower.includes("bebida")) setTab("bebidas");
            else if (lower.includes("prote")) setTab("proteinas");
            else if (lower.includes("acompanha")) setTab("acompanhamentos");
            else if (lower.includes("sobremesas")) setTab("sobremesas");
            else if (lower.includes("prato do dia")) setTab("prato-do-dia");
            else if (lower === "outros") setTab("outros");
            
            // Create new item with this category and appropriate toggles
            createNewItem(target.id);
            if (initialValues) {
               setInitialValues(prev => prev ? ({ ...prev, ...toggles }) : null);
            }
         }
      } catch (e: any) {
         setSnack({
            open: true,
            message: e?.response?.data?.message || e.message || "Erro ao criar categoria",
            severity: "error",
         });
      }
   };

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
            
            {userRole === "ADMIN" && (
               <Button
                  variant="contained"
                  onClick={() => createNewItem()}
                  disabled={loadingCategories}
               >
                  Novo Item
               </Button>
            )}
         </Box>

         {/* Ações rápidas + abas para separar listagens */}
         <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
               Tipos rápidos
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>

               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Prato do Dia")}
               >
                  Prato do Dia
               </Button>
               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Bebidas")}
               >
                  Bebidas
               </Button>
               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Proteínas")}
               >
                  Proteínas
               </Button>
               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Acompanhamentos")}
               >
                  Acompanhamentos
               </Button>
               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Sobremesas")}
               >
                  Sobremesas
               </Button>
               <Button
                  size="small"
                  variant="outlined"
                  disabled={loadingCategories}
                  onClick={() => ensurePresetCategory("Outros")}
               >
                  Outros
               </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />

            {/* Tabs dedicadas por listagem */}
            {(() => {
               const filteredItems = filterItemsByCategory(items);
               const { bebidas, proteinas, acompanhamentos, pratoDoDia, sobremesas, outros } = filteredItems;

               return (
                  <>
                     <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ mb: 1 }}
                     >
                        <Tab value="todos" label={`Todos (${items.length})`} />
                        <Tab value="bebidas" label={`Bebidas (${bebidas.length})`} />
                        <Tab value="prato-do-dia" label={`Prato do Dia (${pratoDoDia.length})`} />
                        <Tab value="proteinas" label={`Proteínas (${proteinas.length})`} />
                        <Tab value="acompanhamentos" label={`Acompanhamentos (${acompanhamentos.length})`} />
                        <Tab value="sobremesas" label={`Sobremesas (${sobremesas.length})`} />
                        <Tab value="outros" label={`Outros (${outros.length})`} />
                     </Tabs>
                  </>
               );
            })()}
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
            (() => {
               const toGrid = (list: MenuItem[]) =>
                  list.map((i) => ({
                     id: i.id,
                     name: i.name,
                     description: i.description,
                     price: Number(i.price),
                     image: i.image,
                     available: i.available,
                     category: i.category ? { name: i.category.name } : undefined,
                     preparationTime: i.preparationTime,
                  }));
               const filteredItems = filterItemsByCategory(items);
               const { bebidas, proteinas, acompanhamentos, pratoDoDia, sobremesas, outros } = filteredItems;

               const byTab = {
                  todos: items,
                  "prato-do-dia": pratoDoDia,
                  bebidas,
                  proteinas,
                  acompanhamentos,
                  sobremesas,
                  outros,
               } as Record<TabKey, MenuItem[]>;

               const current = byTab[tab];
               return (
                  <MenuItemsGrid
                     items={toGrid(current)}
                     onEdit={(item) => {
                        setIsViewMode(false);
                        const target = items.find((i) => i.id === item.id);
                        if (target) {
                           setInitialValues({
                              name: target.name,
                              description: target.description || "",
                              price: target.price.toString(),
                              categoryId: target.categoryId,
                              available: target.available,
                              preparationTime: target.preparationTime ? target.preparationTime.toString() : "",
                              image: target.image || "",
                              isBase: target.isBase || false,
                              isProteina: target.isProteina || false,
                              isAcompanhamento: target.isAcompanhamento || false,
                              isBebida: target.isBebida || false,
                           });
                        }
                        setCreateOpen(true);
                     }}
                     onDelete={async (item) => {
                        if (!window.confirm(`Remover o item "${item.name}"?`)) return;
                        try {
                           await menuAPI.deleteMenuItem(item.id);
                           setItems((prev) => prev.filter((p) => p.id !== item.id));
                        } catch (e: any) {
                           setSnack({
                              open: true,
                              message: e?.response?.data?.message || e.message || "Erro ao remover item",
                              severity: "error",
                           });
                        }
                     }}
                     onView={(item) => {
                        setIsViewMode(true);
                        setCreateOpen(true);
                        const target = items.find((i) => i.id === item.id);
                        if (target) {
                           setInitialValues({
                              name: target.name,
                              description: target.description || "",
                              price: target.price.toString(),
                              categoryId: target.categoryId,
                              available: target.available,
                              preparationTime: target.preparationTime ? target.preparationTime.toString() : "",
                              image: target.image || "",
                              isBase: target.isBase || false,
                              isProteina: target.isProteina || false,
                              isAcompanhamento: target.isAcompanhamento || false,
                              isBebida: target.isBebida || false,
                           });
                        }
                     }}
                  />
               );
            })()
         )}


         <MenuItemForm
            open={createOpen}
            loading={creating}
            error={formError}
            initialValues={initialValues ?? undefined}
            viewMode={isViewMode}
            onCancel={() => {
               setCreateOpen(false);
               setIsViewMode(false);
               setInitialValues(null);
            }}
            onSubmit={async (vals: MenuItemFormValues) => {
               setFormError(null);
               setCreating(true);
               try {
                  const itemData = {
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
                  };

                  // Check if we're editing (initialValues contains existing item data) or creating new
                  const isEditing = initialValues && initialValues.name && initialValues.price;
                  
                  if (isEditing) {
                     // Find the item being edited
                     const existingItem = items.find(item => 
                        item.name === initialValues.name && 
                        item.price.toString() === initialValues.price
                     );
                     
                     if (existingItem) {
                        const updated = await menuAPI.updateMenuItem(existingItem.id, itemData);
                        setItems((prev) => prev.map(item => item.id === existingItem.id ? updated : item));
                        setSnack({ open: true, message: "Item atualizado com sucesso", severity: "success" });
                     }
                  } else {
                     const created = await menuAPI.createMenuItem(itemData);
                     setItems((prev) => [created, ...prev]);
                     setSnack({ open: true, message: "Item criado com sucesso", severity: "success" });
                  }
                  
                  setCreateOpen(false);
                  setInitialValues(null);
               } catch (e: any) {
                  setFormError(e?.response?.data?.message || e.message || "Erro ao salvar item");
               } finally {
                  setCreating(false);
               }
            }}
         />

         <Snackbar
            open={snack.open}
            autoHideDuration={3000}
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
         >
            <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
               {snack.message}
            </Alert>
         </Snackbar>
      </Box>
   );
};

export default MenuPage;
