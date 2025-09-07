import React from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";

interface Props {
   title: string;
   summary: Record<string, number>;
}

const OrderSummaryCard: React.FC<Props> = ({ title, summary }) => {
   const items = Object.entries(summary);
   
   if (items.length === 0) {
      return null;
   }

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
            {title}
         </Typography>
         
         <Box display="flex" flexWrap="wrap" gap={0.5}>
            {items.map(([item, count]) => (
               <Chip 
                  key={item} 
                  size="small" 
                  label={`${item} (${count})`}
                  color="primary"
                  variant="outlined"
               />
            ))}
         </Box>
         
         <Typography variant="caption" color="text.secondary">
            Total de itens: {items.reduce((total, [, count]) => total + count, 0)}
         </Typography>
      </Paper>
   );
};

export default OrderSummaryCard;