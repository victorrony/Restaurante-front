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
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   Avatar,
} from "@mui/material";
import { Add, Edit, Delete, PersonAdd, AdminPanelSettings, Restaurant, ContactPhone } from "@mui/icons-material";

const UsersPage: React.FC = () => {
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedUser, setSelectedUser] = useState<any>(null);

   // Mock data para demonstração
   const users = [
      {
         id: "1",
         name: "Maria Silva",
         email: "maria@restaurante.com",
         role: "ADMIN",
         status: "active",
         phone: "(11) 99999-9999",
         createdAt: "2024-01-15",
         lastLogin: "2024-03-01 14:30",
      },
      {
         id: "2",
         name: "João Santos",
         email: "joao@restaurante.com",
         role: "RECEPCIONISTA",
         status: "active",
         phone: "(11) 88888-8888",
         createdAt: "2024-02-10",
         lastLogin: "2024-03-01 13:45",
      },
      {
         id: "3",
         name: "Ana Costa",
         email: "ana@restaurante.com",
         role: "COZINHEIRA",
         status: "active",
         phone: "(11) 77777-7777",
         createdAt: "2024-02-20",
         lastLogin: "2024-03-01 12:20",
      },
      {
         id: "4",
         name: "Pedro Oliveira",
         email: "pedro@restaurante.com",
         role: "RECEPCIONISTA",
         status: "inactive",
         phone: "(11) 66666-6666",
         createdAt: "2024-01-05",
         lastLogin: "2024-02-15 16:10",
      },
   ];

   const getRoleIcon = (role: string) => {
      switch (role) {
         case "ADMIN":
            return <AdminPanelSettings color="error" />;
         case "COZINHEIRA":
            return <Restaurant color="warning" />;
         case "RECEPCIONISTA":
            return <ContactPhone color="info" />;
         default:
            return <PersonAdd />;
      }
   };

   const getRoleLabel = (role: string) => {
      switch (role) {
         case "ADMIN":
            return "Administrador";
         case "COZINHEIRA":
            return "Cozinheira";
         case "RECEPCIONISTA":
            return "Recepcionista";
         default:
            return role;
      }
   };

   const getRoleColor = (role: string) => {
      switch (role) {
         case "ADMIN":
            return "error";
         case "COZINHEIRA":
            return "warning";
         case "RECEPCIONISTA":
            return "info";
         default:
            return "default";
      }
   };

   const handleEditUser = (user: any) => {
      setSelectedUser(user);
      setOpenDialog(true);
   };

   const handleAddUser = () => {
      setSelectedUser(null);
      setOpenDialog(true);
   };

   const handleCloseDialog = () => {
      setOpenDialog(false);
      setSelectedUser(null);
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
               <Typography variant="h4" gutterBottom fontWeight="bold">
                  Usuários
               </Typography>
               <Typography variant="subtitle1" color="text.secondary">
                  Gerenciamento de usuários do sistema
               </Typography>
            </Box>

            <Button variant="contained" startIcon={<Add />} onClick={handleAddUser}>
               Novo Usuário
            </Button>
         </Box>

         {/* Estatísticas */}
         <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                     {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Total de Usuários
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                     {users.filter((u) => u.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Usuários Ativos
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                     {users.filter((u) => u.role === "ADMIN").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Administradores
                  </Typography>
               </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
               <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                     {users.filter((u) => u.status === "inactive").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     Usuários Inativos
                  </Typography>
               </Paper>
            </Grid>
         </Grid>

         {/* Lista de Usuários */}
         <Card>
            <CardContent>
               <Typography variant="h6" gutterBottom fontWeight="bold">
                  👥 Lista de Usuários
               </Typography>

               <TableContainer component={Paper} variant="outlined">
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Usuário</TableCell>
                           <TableCell>Email</TableCell>
                           <TableCell>Perfil</TableCell>
                           <TableCell>Telefone</TableCell>
                           <TableCell>Status</TableCell>
                           <TableCell>Último Acesso</TableCell>
                           <TableCell align="center">Ações</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {users.map((user) => (
                           <TableRow key={user.id}>
                              <TableCell>
                                 <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: getRoleColor(user.role) + ".main" }}>
                                       {user.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                       <Typography variant="subtitle2" fontWeight="medium">
                                          {user.name}
                                       </Typography>
                                       <Typography variant="caption" color="text.secondary">
                                          ID: {user.id}
                                       </Typography>
                                    </Box>
                                 </Box>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                 <Box display="flex" alignItems="center" gap={1}>
                                    {getRoleIcon(user.role)}
                                    <Chip
                                       label={getRoleLabel(user.role)}
                                       color={getRoleColor(user.role) as any}
                                       size="small"
                                    />
                                 </Box>
                              </TableCell>
                              <TableCell>{user.phone}</TableCell>
                              <TableCell>
                                 <Chip
                                    label={user.status === "active" ? "Ativo" : "Inativo"}
                                    color={user.status === "active" ? "success" : "default"}
                                    size="small"
                                 />
                              </TableCell>
                              <TableCell>
                                 <Typography variant="body2">{user.lastLogin}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                 <IconButton size="small" color="primary" onClick={() => handleEditUser(user)}>
                                    <Edit />
                                 </IconButton>
                                 <IconButton size="small" color="error">
                                    <Delete />
                                 </IconButton>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
            </CardContent>
         </Card>

         {/* Dialog para Adicionar/Editar Usuário */}
         <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>{selectedUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            <DialogContent>
               <Box display="flex" flexDirection="column" gap={2} pt={1}>
                  <TextField label="Nome Completo" fullWidth defaultValue={selectedUser?.name || ""} />
                  <TextField label="Email" type="email" fullWidth defaultValue={selectedUser?.email || ""} />
                  <TextField label="Telefone" fullWidth defaultValue={selectedUser?.phone || ""} />
                  <FormControl fullWidth>
                     <InputLabel>Perfil</InputLabel>
                     <Select defaultValue={selectedUser?.role || ""} label="Perfil">
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                        <MenuItem value="COZINHEIRA">Cozinheira</MenuItem>
                        <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
                     </Select>
                  </FormControl>
                  <FormControl fullWidth>
                     <InputLabel>Status</InputLabel>
                     <Select defaultValue={selectedUser?.status || "active"} label="Status">
                        <MenuItem value="active">Ativo</MenuItem>
                        <MenuItem value="inactive">Inativo</MenuItem>
                     </Select>
                  </FormControl>
                  {!selectedUser && <TextField label="Senha" type="password" fullWidth />}
               </Box>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseDialog}>Cancelar</Button>
               <Button variant="contained" onClick={handleCloseDialog}>
                  {selectedUser ? "Salvar" : "Criar"}
               </Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
};

export default UsersPage;
