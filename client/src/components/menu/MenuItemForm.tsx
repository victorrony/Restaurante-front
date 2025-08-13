import React, { useState, useEffect } from "react";
import {
   Box,
   TextField,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Switch,
   FormControlLabel,
   Typography,
   Button,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
} from "@mui/material";
import { menuAPI } from "../../services/api";
import { Category } from "../../types";

export interface MenuItemFormValues {
   name: string;
   description: string;
   price: string;
   categoryId: string;
   preparationTime: string;
   available: boolean;
   image?: string;
   isBase?: boolean;
   isProteina?: boolean;
   isAcompanhamento?: boolean;
   isBebida?: boolean;
}

interface Props {
   open: boolean;
   loading?: boolean;
   error?: string | null;
   initialValues?: Partial<MenuItemFormValues>;
   onCancel: () => void;
   onSubmit: (values: MenuItemFormValues) => void | Promise<void>;
   allowCreateCategory?: boolean;
}

const defaultValues: MenuItemFormValues = {
   name: "",
   description: "",
   price: "",
   categoryId: "",
   preparationTime: "",
   available: true,
   image: "",
   isBase: false,
   isProteina: false,
   isAcompanhamento: false,
   isBebida: false,
};

const MenuItemForm: React.FC<Props> = ({
   open,
   loading,
   error,
   initialValues,
   onCancel,
   onSubmit,
   allowCreateCategory = true,
}) => {
   const [values, setValues] = useState<MenuItemFormValues>({ ...defaultValues, ...initialValues });
   const [categories, setCategories] = useState<Category[]>([]);
   const [catError, setCatError] = useState<string | null>(null);
   const [creatingCategory, setCreatingCategory] = useState(false);
   const [newCategoryName, setNewCategoryName] = useState("");
   const [newCategoryDesc, setNewCategoryDesc] = useState("");

   useEffect(() => {
      if (open) {
         setValues({ ...defaultValues, ...initialValues });
         (async () => {
            try {
               setCatError(null);
               const data = await menuAPI.getCategories();
               setCategories(data);
            } catch (e: any) {
               setCatError(e?.response?.data?.message || e.message || "Falha ao carregar categorias");
            }
         })();
      }
   }, [open, initialValues]);

   const handleChange = (field: keyof MenuItemFormValues, value: any) => {
      setValues((v) => ({ ...v, [field]: value }));
   };

   const handleSubmit = async () => {
      if (!values.name.trim() || !values.price || !values.categoryId) return;
      await onSubmit(values);
   };

   return (
      <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
         <DialogTitle>{initialValues?.name ? "Editar Item" : "Novo Item do Cardápio"}</DialogTitle>
         <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
               label="Nome"
               value={values.name}
               onChange={(e) => handleChange("name", e.target.value)}
               fullWidth
            />
            <TextField
               label="Descrição"
               value={values.description}
               onChange={(e) => handleChange("description", e.target.value)}
               fullWidth
               multiline
               minRows={2}
            />
            <Box display="flex" gap={2} flexWrap="wrap">
               <TextField
                  label="Preço"
                  type="number"
                  value={values.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  sx={{ flex: 1, minWidth: 140 }}
                  inputProps={{ min: 0, step: 0.01 }}
               />
               <TextField
                  label="Tempo Prep. (min)"
                  type="number"
                  value={values.preparationTime}
                  onChange={(e) => handleChange("preparationTime", e.target.value)}
                  sx={{ width: 180 }}
                  inputProps={{ min: 0 }}
               />
            </Box>
            <FormControl fullWidth>
               <InputLabel>Categoria</InputLabel>
               <Select
                  value={values.categoryId}
                  label="Categoria"
                  onChange={(e) => handleChange("categoryId", e.target.value)}
               >
                  {categories.map((c) => (
                     <MenuItem key={c.id} value={c.id}>
                        {c.name}
                     </MenuItem>
                  ))}
                  {allowCreateCategory && (
                     <MenuItem value="__new__" sx={{ fontStyle: "italic" }}>
                        + Nova Categoria
                     </MenuItem>
                  )}
               </Select>
            </FormControl>
            {values.categoryId === "__new__" && allowCreateCategory && (
               <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  p={1}
                  border="1px dashed"
                  borderColor="divider"
                  borderRadius={1}
               >
                  <Typography variant="caption" fontWeight="bold">
                     Nova Categoria
                  </Typography>
                  <TextField
                     size="small"
                     label="Nome da Categoria"
                     value={newCategoryName}
                     onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <TextField
                     size="small"
                     label="Descrição (opcional)"
                     value={newCategoryDesc}
                     onChange={(e) => setNewCategoryDesc(e.target.value)}
                  />
                  <Box display="flex" gap={1}>
                     <Button
                        size="small"
                        variant="outlined"
                        disabled={creatingCategory || !newCategoryName.trim()}
                        onClick={async () => {
                           try {
                              setCreatingCategory(true);
                              const newCat = await menuAPI.createCategory({
                                 name: newCategoryName.trim(),
                                 description: newCategoryDesc.trim() || undefined,
                              });
                              setCategories((prev) => [...prev, newCat]);
                              setValues((v) => ({ ...v, categoryId: newCat.id }));
                              setNewCategoryName("");
                              setNewCategoryDesc("");
                           } catch (e: any) {
                              setCatError(e?.response?.data?.message || e.message || "Erro ao criar categoria");
                           } finally {
                              setCreatingCategory(false);
                           }
                        }}
                     >
                        Salvar Categoria
                     </Button>
                     <Button
                        size="small"
                        onClick={() => {
                           setValues((v) => ({ ...v, categoryId: "" }));
                           setNewCategoryName("");
                           setNewCategoryDesc("");
                        }}
                     >
                        Cancelar
                     </Button>
                  </Box>
               </Box>
            )}
            <FormControlLabel
               control={
                  <Switch checked={values.available} onChange={(e) => handleChange("available", e.target.checked)} />
               }
               label="Disponível"
            />
            <Typography variant="caption" sx={{ mt: 1 }}>
               Marcar como componente de refeição (opcional)
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
               <FormControlLabel
                  control={
                     <Switch checked={!!values.isBase} onChange={(e) => handleChange("isBase", e.target.checked)} />
                  }
                  label="Base"
               />
               <FormControlLabel
                  control={
                     <Switch
                        checked={!!values.isProteina}
                        onChange={(e) => handleChange("isProteina", e.target.checked)}
                     />
                  }
                  label="Proteína"
               />
               <FormControlLabel
                  control={
                     <Switch
                        checked={!!values.isAcompanhamento}
                        onChange={(e) => handleChange("isAcompanhamento", e.target.checked)}
                     />
                  }
                  label="Acomp."
               />
               <FormControlLabel
                  control={
                     <Switch checked={!!values.isBebida} onChange={(e) => handleChange("isBebida", e.target.checked)} />
                  }
                  label="Bebida"
               />
            </Box>
            <TextField
               label="URL da Imagem (opcional)"
               value={values.image}
               onChange={(e) => handleChange("image", e.target.value)}
               fullWidth
            />
            {(error || catError) && (
               <Typography variant="caption" color="error">
                  {error || catError}
               </Typography>
            )}
         </DialogContent>
         <DialogActions>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button
               variant="contained"
               disabled={
                  loading ||
                  !values.name.trim() ||
                  !values.price ||
                  !values.categoryId ||
                  values.categoryId === "__new__"
               }
               onClick={handleSubmit}
            >
               {loading ? "Salvando..." : "Salvar"}
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default MenuItemForm;
