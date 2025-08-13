import React from "react";
import { Paper, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

export type BaseTipo = "ARROZ" | "SOPA";
export type ProteinaTipo = "CARNE" | "PEIXE";
export type AcompanhamentoTipo = "LEGUMES" | "SALADA";

export interface GuestSelection {
   id: number;
   base: BaseTipo;
   proteina: ProteinaTipo;
   acompanhamento: AcompanhamentoTipo;
   observacao?: string;
   bebidas?: string; // Ex: "REFRIGERANTE", "SUCO", "ÁGUA"
}

interface Props {
   guest: GuestSelection;
   onChange: (patch: Partial<GuestSelection>) => void;
}

const GuestMealCard: React.FC<Props> = ({ guest, onChange }) => {
   return (
      <Paper variant="outlined" sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
         <Typography variant="body2" fontWeight="bold">
            Pessoa #{guest.id}
         </Typography>

         <FormControl size="small">
            <InputLabel>Base</InputLabel>
            <Select value={guest.base} label="Base" onChange={(e) => onChange({ base: e.target.value as BaseTipo })}>
               <MenuItem value="ARROZ">Arroz</MenuItem>
               <MenuItem value="SOPA">Sopa</MenuItem>
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Proteína</InputLabel>
            <Select
               value={guest.proteina}
               label="Proteína"
               onChange={(e) => onChange({ proteina: e.target.value as ProteinaTipo })}
            >
               <MenuItem value="CARNE">Carne</MenuItem>
               <MenuItem value="PEIXE">Peixe</MenuItem>
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Acomp.</InputLabel>
            <Select
               value={guest.acompanhamento}
               label="Acomp."
               onChange={(e) => onChange({ acompanhamento: e.target.value as AcompanhamentoTipo })}
            >
               <MenuItem value="LEGUMES">Legumes</MenuItem>
               <MenuItem value="SALADA">Salada</MenuItem>
            </Select>
         </FormControl>

         <FormControl size="small">
            <InputLabel>Bebidas</InputLabel>
            <Select
               value={guest.bebidas}
               label="Bebidas"
               onChange={(e) => onChange({ bebidas: e.target.value as string })}
            >
               <MenuItem value="REFRIGERANTE">Refrigerante</MenuItem>
               <MenuItem value="SUCO">Suco</MenuItem>
               <MenuItem value="ÁGUA">Água</MenuItem>
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
