import React, { useState } from "react";
import {
   Box,
   Typography,
   Grid,
   Card,
   CardContent,
   Button,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Paper,
   Chip,
   Rating,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   Avatar,
   Divider,
} from "@mui/material";
import { Feedback, Star, Reply, ThumbUp, ThumbDown, Restaurant } from "@mui/icons-material";

const FeedbackPage: React.FC = () => {
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

   // Mock data para demonstração
   const feedbacks = [
      {
         id: "1",
         customerName: "Carlos Silva",
         customerEmail: "carlos@email.com",
         rating: 5,
         comment: "Excelente serviço! A comida estava deliciosa e o atendimento foi impecável. Recomendo muito!",
         category: "food",
         orderId: "ORD001",
         tableNumber: 5,
         createdAt: "2024-03-01 19:30",
         status: "pending",
         response: null,
      },
      {
         id: "2",
         customerName: "Maria Santos",
         customerEmail: "maria@email.com",
         rating: 4,
         comment: "Boa comida, mas o tempo de espera foi um pouco longo. No geral, uma experiência positiva.",
         category: "service",
         orderId: "ORD002",
         tableNumber: 3,
         createdAt: "2024-03-01 18:15",
         status: "responded",
         response: "Obrigado pelo feedback! Estamos trabalhando para melhorar nosso tempo de atendimento.",
      },
      {
         id: "3",
         customerName: "João Oliveira",
         customerEmail: "joao@email.com",
         rating: 3,
         comment: "O ambiente é agradável, mas a comida chegou fria. Espero que melhorem.",
         category: "food",
         orderId: "ORD003",
         tableNumber: 7,
         createdAt: "2024-03-01 17:45",
         status: "pending",
         response: null,
      },
      {
         id: "4",
         customerName: "Ana Costa",
         customerEmail: "ana@email.com",
         rating: 5,
         comment: "Perfeito! Tudo estava maravilhoso. Voltarei em breve!",
         category: "overall",
         orderId: "ORD004",
         tableNumber: 2,
         createdAt: "2024-03-01 16:20",
         status: "responded",
         response: "Muito obrigado! Ficamos felizes em saber que você gostou. Esperamos vê-la novamente!",
      },
   ];

   const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
   const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;
   const negativeCount = feedbacks.filter((f) => f.rating <= 2).length;
   const pendingCount = feedbacks.filter((f) => f.status === "pending").length;

   const getCategoryLabel = (category: string) => {
      switch (category) {
         case "food":
            return "Comida";
         case "service":
            return "Atendimento";
         case "overall":
            return "Geral";
         default:
            return category;
      }
   };

   const getCategoryColor = (category: string) => {
      switch (category) {
         case "food":
            return "warning";
         case "service":
            return "info";
         case "overall":
            return "success";
         default:
            return "default";
      }
   };

   const handleViewFeedback = (feedback: any) => {
      setSelectedFeedback(feedback);
      setOpenDialog(true);
   };

   const handleCloseDialog = () => {
      setOpenDialog(false);
      setSelectedFeedback(null);
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Feedback dos Clientes
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Avaliações e comentários dos clientes
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Feedback />}>
               Exportar Relatório
            </Button>
         </Box>

         {/* Estatísticas */}
         <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                     <Star color="warning" sx={{ fontSize: 30 }} />
                     <Typography variant="h4" color="warning.main" fontWeight="bold" ml={1}>
                        {averageRating.toFixed(1)}
                     </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                     Avaliação Média
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                     <ThumbUp color="success" sx={{ fontSize: 30 }} />
                     <Typography variant="h4" color="success.main" fontWeight="bold" ml={1}>
                        {positiveCount}
                     </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                     Avaliações Positivas
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                     <ThumbDown color="error" sx={{ fontSize: 30 }} />
                     <Typography variant="h4" color="error.main" fontWeight="bold" ml={1}>
                        {negativeCount}
                     </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                     Avaliações Negativas
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                     <Reply color="primary" sx={{ fontSize: 30 }} />
                     <Typography variant="h4" color="primary" fontWeight="bold" ml={1}>
                        {pendingCount}
                     </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                     Pendentes de Resposta
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         {/* Lista de Feedbacks */}
         <Card>
            <CardContent>
               <Typography variant="h6" gutterBottom fontWeight="bold">
                  💬 Feedbacks Recentes
               </Typography>

               <TableContainer component={Paper} variant="outlined">
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Cliente</TableCell>
                           <TableCell>Avaliação</TableCell>
                           <TableCell>Categoria</TableCell>
                           <TableCell>Mesa/Pedido</TableCell>
                           <TableCell>Data</TableCell>
                           <TableCell>Status</TableCell>
                           <TableCell align="center">Ações</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {feedbacks.map((feedback) => (
                           <TableRow key={feedback.id}>
                              <TableCell>
                                 <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: "primary.main" }}>{feedback.customerName.charAt(0)}</Avatar>
                                    <Box>
                                       <Typography variant="subtitle2" fontWeight="medium">
                                          {feedback.customerName}
                                       </Typography>
                                       <Typography variant="caption" color="text.secondary">
                                          {feedback.customerEmail}
                                       </Typography>
                                    </Box>
                                 </Box>
                              </TableCell>
                              <TableCell>
                                 <Box display="flex" alignItems="center" gap={1}>
                                    <Rating value={feedback.rating} readOnly size="small" />
                                    <Typography variant="body2" fontWeight="bold">
                                       {feedback.rating}/5
                                    </Typography>
                                 </Box>
                              </TableCell>
                              <TableCell>
                                 <Chip
                                    label={getCategoryLabel(feedback.category)}
                                    color={getCategoryColor(feedback.category) as any}
                                    size="small"
                                 />
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">Mesa {feedback.tableNumber}</Typography>
                                 <Typography variant="caption" color="text.secondary">
                                    {feedback.orderId}
                                 </Typography>
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">{feedback.createdAt}</Typography>
                              </TableCell>
                              <TableCell>
                                 <Chip
                                    label={feedback.status === "pending" ? "Pendente" : "Respondido"}
                                    color={feedback.status === "pending" ? "warning" : "success"}
                                    size="small"
                                 />
                              </TableCell>
                              <TableCell align="center">
                                 <Button size="small" variant="outlined" onClick={() => handleViewFeedback(feedback)}>
                                    Ver Detalhes
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            </CardContent>
         </Card>

         {/* Dialog para Ver/Responder Feedback */}
         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
               <Box display="flex" alignItems="center" gap={2}>
                  <Restaurant />
                  Feedback do Cliente
               </Box>
            </DialogTitle>
            <DialogContent>
               {selectedFeedback && (
                  <Box>
                     {/* Informações do Cliente */}
                     <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>{selectedFeedback.customerName.charAt(0)}</Avatar>
                        <Box>
                           <Typography variant="h6">{selectedFeedback.customerName}</Typography>
                           <Typography variant="body2" color="text.secondary">
                              {selectedFeedback.customerEmail}
                           </Typography>
                        </Box>
                     </Box>

                     <Divider sx={{ my: 2 }} />

                     {/* Detalhes do Pedido */}
                     <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                           <Typography variant="caption" color="text.secondary">
                              Pedido
                           </Typography>
                           <Typography variant="body2">{selectedFeedback.orderId}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography variant="caption" color="text.secondary">
                              Mesa
                           </Typography>
                           <Typography variant="body2">Mesa {selectedFeedback.tableNumber}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography variant="caption" color="text.secondary">
                              Data
                           </Typography>
                           <Typography variant="body2">{selectedFeedback.createdAt}</Typography>
                        </Grid>
                     </Grid>

                     {/* Avaliação */}
                     <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">
                           Avaliação
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                           <Rating value={selectedFeedback.rating} readOnly />
                           <Chip
                              label={getCategoryLabel(selectedFeedback.category)}
                              color={getCategoryColor(selectedFeedback.category) as any}
                              size="small"
                           />
                        </Box>
                     </Box>

                     {/* Comentário */}
                     <Box mb={2}>
                        <Typography variant="caption" color="text.secondary">
                           Comentário
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                           <Typography variant="body1">{selectedFeedback.comment}</Typography>
                        </Paper>
                     </Box>

                     {/* Resposta Existente */}
                     {selectedFeedback.response && (
                        <Box mb={2}>
                           <Typography variant="caption" color="text.secondary">
                              Nossa Resposta
                           </Typography>
                           <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: "primary.50" }}>
                              <Typography variant="body1">{selectedFeedback.response}</Typography>
                           </Paper>
                        </Box>
                     )}

                     {/* Campo para Nova Resposta */}
                     {selectedFeedback.status === "pending" && (
                        <Box>
                           <Typography variant="caption" color="text.secondary">
                              Responder ao Cliente
                           </Typography>
                           <TextField
                              fullWidth
                              multiline
                              rows={3}
                              placeholder="Digite sua resposta ao cliente..."
                              sx={{ mt: 1 }}
                           />
                        </Box>
                     )}
                  </Box>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseDialog}>Fechar</Button>
               {selectedFeedback?.status === "pending" && (
                  <Button variant="contained" onClick={handleCloseDialog}>
                     Enviar Resposta
                  </Button>
               )}
            </DialogActions>
         </Dialog>
      </Box>
   );
};

export default FeedbackPage;
