import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { GuestSelection } from "./GuestSelectionCard";

interface Props {
   guest: GuestSelection;
}

const GuestMealSummaryCard: React.FC<Props> = ({ guest }) => {
   const descricao = `${guest.base} + ${guest.proteina} + ${guest.acompanhamento}`;
   return (
      <Paper
         variant="outlined"
         sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            borderLeft: "4px solid #1976d2",
         }}
      >
         <Typography variant="body2" fontWeight="bold">
            Pedido Pessoa #{guest.id}
         </Typography>
         <Box display="flex" flexWrap="wrap" gap={0.5}>
            <Chip size="small" label={guest.base} />
            <Chip size="small" color="info" label={guest.proteina} />
            <Chip size="small" color="success" label={guest.acompanhamento} />
         </Box>
         <Typography variant="caption" color="text.secondary">
            {descricao}
         </Typography>
         {guest.observacao && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
               Obs: {guest.observacao}
            </Typography>
         )}
      </Paper>
   );
};

export default GuestMealSummaryCard;
