import React, { useState, useEffect } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   Button,
   MenuItem,
   Box,
   CircularProgress,
   Typography,
} from "@mui/material";
import { Table } from "../../types";

interface TableFormModalProps {
   open: boolean;
   table: Table | null;
   existingTables: Table[];
   onClose: () => void;
   onSubmit: (tableData: Omit<Table, "id" | "qrCode">) => Promise<void>;
   loading?: boolean;
}

const TableFormModal: React.FC<TableFormModalProps> = ({
   open,
   table,
   existingTables,
   onClose,
   onSubmit,
   loading = false,
}) => {
   const [formData, setFormData] = useState({
      number: 1,
      capacity: 2,
      status: "LIVRE" as Table["status"],
   });

   const [errors, setErrors] = useState<Record<string, string>>({});

   useEffect(() => {
      if (table) {
         setFormData({
            number: table.number,
            capacity: table.capacity,
            status: table.status,
         });
      } else {
         // Auto-suggest next available table number
         const existingNumbers = existingTables?.map(t => t.number);
         const nextNumber = Math.max(0, ...existingNumbers) + 1;
         
         setFormData({
            number: nextNumber,
            capacity: 2,
            status: "LIVRE",
         });
      }
      setErrors({});
   }, [table, open, existingTables]);

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (formData.number < 1) {
         newErrors.number = "Número da mesa deve ser maior que 0";
      }

      // Check for duplicate table numbers (only when creating or if number changed)
      const isDuplicate = existingTables.some(
         existingTable => existingTable.number === formData.number && existingTable.id !== table?.id
      );
      
      if (isDuplicate) {
         newErrors.number = "Já existe uma mesa com este número";
      }

      if (formData.capacity < 1) {
         newErrors.capacity = "Capacidade deve ser maior que 0";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
         await onSubmit(formData);
         onClose();
      } catch (error) {
         // Error handling is done in parent component
      }
   };

   const handleChange = (field: keyof typeof formData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
         setErrors(prev => ({ ...prev, [field]: "" }));
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle>
            {table ? "Editar Mesa" : "Nova Mesa"}
         </DialogTitle>

         <DialogContent>
            <Box sx={{ pt: 2 }}>
               {table && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                     <Typography variant="body2" color="info.dark">
                        📝 Apenas o status e capacidade da mesa podem ser alterados. O número não pode ser modificado.
                     </Typography>
                  </Box>
               )}
               
               <TextField
                  fullWidth
                  label="Número da Mesa"
                  type="number"
                  value={formData.number}
                  onChange={(e) => handleChange("number", parseInt(e.target.value) || 0)}
                  error={!!errors.number}
                  helperText={errors.number || (table ? "Campo não editável" : "")}
                  sx={{ mb: 3 }}
                  InputProps={{ inputProps: { min: 1 } }}
                  disabled={!!table}
               />

               <TextField
                  fullWidth
                  label="Capacidade (pessoas)"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  sx={{ mb: 3 }}
                  InputProps={{ inputProps: { min: 1 } }}
               />

               <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value as Table["status"])}
                  sx={{ mb: 2 }}
               >
                  <MenuItem value="LIVRE">Livre</MenuItem>
                  <MenuItem value="OCUPADA">Ocupada</MenuItem>
                  <MenuItem value="RESERVADA">Reservada</MenuItem>
                  <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
               </TextField>
            </Box>
         </DialogContent>

         <DialogActions>
            <Button onClick={onClose} disabled={loading}>
               Cancelar
            </Button>
            <Button
               onClick={handleSubmit}
               variant="contained"
               disabled={loading}
               startIcon={loading ? <CircularProgress size={20} /> : null}
            >
               {table ? "Atualizar" : "Criar"}
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default TableFormModal;