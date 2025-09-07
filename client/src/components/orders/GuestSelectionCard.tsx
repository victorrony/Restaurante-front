import React, { useState, useEffect } from "react";
import {
   Paper,
   Typography,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   TextField,
   CircularProgress,
} from "@mui/material";
import { menuAPI } from "../../services/api";
import { MenuItem as MenuItemType } from "../../types";

// Updated to use menu item IDs instead of hardcoded strings
export type BaseTipo = string;
export type ProteinaTipo = string;
export type AcompanhamentoTipo = string;
export type BebidaTipo = string;
export type SobremesaTipo = string;

export interface GuestSelection {
   id: number;
   base: BaseTipo;
   proteina: ProteinaTipo;
   acompanhamento: AcompanhamentoTipo;
   observacao?: string;
   bebidas?: BebidaTipo;
   sobremesas?: string;
}

interface Props {
   guest: GuestSelection;
   onChange: (patch: Partial<GuestSelection>) => void;
}

const GuestMealCard: React.FC<Props> = ({ guest, onChange }) => {
   const [baseItems, setBaseItems] = useState<MenuItemType[]>([]);
   const [proteinaItems, setProteinaItems] = useState<MenuItemType[]>([]);
   const [acompanhamentoItems, setAcompanhamentoItems] = useState<MenuItemType[]>([]);
   const [bebidaItems, setBebidaItems] = useState<MenuItemType[]>([]);
   const [sobremesaItems, setSobremesaItems] = useState<MenuItemType[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const loadMenuItems = async () => {
         try {
            setLoading(true);
            setError(null);

            // Get all menu items first
            const allMenuItems = await menuAPI.getMenuItems({ includeAll: false });
            
            // Filter by flags and category
            const bases = allMenuItems.filter(item => item.isBase && item.available);
            const proteinas = allMenuItems.filter(item => item.isProteina && item.available);
            const acompanhamentos = allMenuItems.filter(item => item.isAcompanhamento && item.available);
            const bebidas = allMenuItems.filter(item => item.isBebida && item.available);
            // Filter desserts by category name instead of flag
            const sobremesas = allMenuItems.filter(item => 
               item.available && 
               item.category?.name?.toLowerCase().includes('sobremesa')
            );

            setBaseItems(bases);
            setProteinaItems(proteinas);
            setAcompanhamentoItems(acompanhamentos);
            setBebidaItems(bebidas);
            setSobremesaItems(sobremesas);
         } catch (err: any) {
            console.error("Error loading menu items:", err);
            setError("Erro ao carregar opções do menu");
         } finally {
            setLoading(false);
         }
      };

      loadMenuItems();
   }, []);

   if (loading) {
      return (
         <Paper
            variant="outlined"
            sx={{ p: 1.5, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}
         >
            <CircularProgress size={24} />
         </Paper>
      );
   }

   if (error) {
      return (
         <Paper
            variant="outlined"
            sx={{ p: 1.5, display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}
         >
            <Typography color="error" variant="body2">
               {error}
            </Typography>
         </Paper>
      );
   }

   return (
      <Paper variant="outlined" sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
         <Typography variant="body2" fontWeight="bold">
            Pessoa #{guest.id}
         </Typography>

         <FormControl size="small">
            <InputLabel>Base</InputLabel>
            <Select value={guest.base} label="Base" onChange={(e) => onChange({ base: e.target.value as BaseTipo })}>
               <MenuItem value="">
                  <em>Selecione uma base</em>
               </MenuItem>
               {baseItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                     {item.name} {item.price && `- R$ ${Number(item.price).toFixed(2)}`}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Proteína</InputLabel>
            <Select
               value={guest.proteina}
               label="Proteína"
               onChange={(e) => onChange({ proteina: e.target.value as ProteinaTipo })}
            >
               <MenuItem value="">
                  <em>Selecione uma proteína</em>
               </MenuItem>
               {proteinaItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                     {item.name} {item.price && `- R$ ${Number(item.price).toFixed(2)}`}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Acomp.</InputLabel>
            <Select
               value={guest.acompanhamento}
               label="Acomp."
               onChange={(e) => onChange({ acompanhamento: e.target.value as AcompanhamentoTipo })}
            >
               <MenuItem value="">
                  <em>Selecione um acompanhamento</em>
               </MenuItem>
               {acompanhamentoItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                     {item.name} {item.price && `- R$ ${Number(item.price).toFixed(2)}`}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Bebidas</InputLabel>
            <Select
               value={guest.bebidas || ""}
               label="Bebidas"
               onChange={(e) => onChange({ bebidas: e.target.value as BebidaTipo })}
            >
               <MenuItem value="">
                  <em>Selecione uma bebida</em>
               </MenuItem>
               {bebidaItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                     {item.name} {item.price && `- R$ ${Number(item.price).toFixed(2)}`}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Sobremesas</InputLabel>
            <Select
               value={guest.sobremesas || ""}
               label="Sobremesas"
               onChange={(e) => onChange({ sobremesas: e.target.value as SobremesaTipo })}
            >
               <MenuItem value="">
                  <em>Selecione uma sobremesa</em>
               </MenuItem>
               {sobremesaItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                     {item.name} {item.price && `- R$ ${Number(item.price).toFixed(2)}`}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         <TextField
            size="small"
            label="Obs."
            value={guest.observacao || ""}
            onChange={(e) => onChange({ observacao: e.target.value })}
         />
      </Paper>
   );
};

export default GuestMealCard;
