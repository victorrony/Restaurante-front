import React, { useState, useEffect } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Box,
   Typography,
   CircularProgress,
   Alert,
} from "@mui/material";
import QRCode from "qrcode";
import { Table } from "../../types";
import { tablesAPI } from "../../services/api";

interface QRCodeModalProps {
   open: boolean;
   table: Table | null;
   onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ open, table, onClose }) => {
   const [qrCodeImage, setQrCodeImage] = useState<string>("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (open && table) {
         generateQRCode();
      }
   }, [open, table]);

   const generateQRCode = async () => {
      if (!table) return;

      try {
         setLoading(true);
         setError(null);
         const { qrCode: qrData } = await tablesAPI.getTableQR(table.number);
         
         // Generate QR code image
         const qrCodeDataURL = await QRCode.toDataURL(qrData, {
            width: 256,
            margin: 2,
            color: {
               dark: '#000000',
               light: '#FFFFFF'
            }
         });
         setQrCodeImage(qrCodeDataURL);
      } catch (error: any) {
         setError(error.message || "Erro ao gerar QR Code");
      } finally {
         setLoading(false);
      }
   };

   const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
         printWindow.document.write(`
            <html>
               <head>
                  <title>QR Code - Mesa ${table?.number}</title>
                  <style>
                     body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 20px; 
                     }
                     .qr-container { 
                        display: inline-block; 
                        padding: 20px; 
                        border: 2px solid #333; 
                        border-radius: 10px; 
                     }
                     @media print {
                        .no-print { display: none; }
                     }
                  </style>
               </head>
               <body>
                  <div class="qr-container">
                     <h2>Mesa ${table?.number}</h2>
                     <img src="${qrCodeImage}" alt="QR Code" style="width: 256px; height: 256px;" />
                     <p>Escaneie para ver o cardápio</p>
                  </div>
                  <script>window.print(); window.close();</script>
               </body>
            </html>
         `);
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle>
            QR Code - Mesa {table?.number}
         </DialogTitle>

         <DialogContent>
            <Box sx={{ textAlign: "center", py: 2 }}>
               {loading && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                     <CircularProgress />
                  </Box>
               )}

               {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                     {error}
                  </Alert>
               )}

               {qrCodeImage && !loading && (
                  <>
                     <Typography variant="h6" gutterBottom>
                        Mesa {table?.number}
                     </Typography>
                     <Typography variant="body2" color="text.secondary" gutterBottom>
                        Capacidade: {table?.capacity} pessoas
                     </Typography>
                     
                     <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
                        <div id="qr-code-image">
                           <img 
                              src={qrCodeImage} 
                              alt="QR Code" 
                              style={{ width: 256, height: 256 }}
                           />
                        </div>
                     </Box>
                     
                     <Typography variant="body2" color="text.secondary">
                        Escaneie este QR Code para acessar o cardápio digital
                     </Typography>
                  </>
               )}
            </Box>
         </DialogContent>

         <DialogActions>
            <Button onClick={onClose}>
               Fechar
            </Button>
            {qrCodeImage && !loading && (
               <Button onClick={handlePrint} variant="contained">
                  Imprimir
               </Button>
            )}
         </DialogActions>
      </Dialog>
   );
};

export default QRCodeModal;