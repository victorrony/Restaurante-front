import React, { useState, useEffect } from "react";
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
   CircularProgress,
   Snackbar,
   Alert,
} from "@mui/material";
import { Add, Edit, Delete, PersonAdd, AdminPanelSettings, Restaurant, ContactPhone } from "@mui/icons-material";
import { usersAPI } from "../../services/api";
import { User } from "../../types";

interface UserFormData {
   name: string;
   email: string;
   phone?: string;
   role: "ADMIN" | "RECEPCIONISTA" | "COZINHEIRA";
   active: boolean;
   password?: string;
}

const UsersPage: React.FC = () => {
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState(false);
   const [saving, setSaving] = useState(false);
   const [formData, setFormData] = useState<UserFormData>({
      name: "",
      email: "",
      phone: "",
      role: "RECEPCIONISTA",
      active: true,
      password: "",
   });
   const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});
   const [snack, setSnack] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
      open: false,
      message: "",
      severity: "success",
   });

   // Load users from API
   const loadUsers = async () => {
      try {
         setLoading(true);
         const data = await usersAPI.getUsers();
         setUsers(data);
      } catch (error: any) {
         setSnack({
            open: true,
            message: error?.response?.data?.message || "Erro ao carregar usuários",
            severity: "error",
         });
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadUsers();
   }, []);

   // Validation
   const validateForm = (): boolean => {
      const errors: Partial<UserFormData> = {};

      if (!formData.name.trim()) errors.name = "Nome é obrigatório";
      if (!formData.email.trim()) errors.email = "Email é obrigatório";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email inválido";

      if (!selectedUser && !formData.password?.trim()) {
         errors.password = "Senha é obrigatória para novos usuários";
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
   };

   const resetForm = () => {
      setFormData({
         name: "",
         email: "",
         phone: "",
         role: "RECEPCIONISTA",
         active: true,
         password: "",
      });
      setFormErrors({});
   };

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

   const handleEditUser = (user: User) => {
      setSelectedUser(user);
      setFormData({
         name: user.name,
         email: user.email,
         phone: user.phone || "",
         role: user.role,
         active: user.active,
         password: "", // Don't prefill password for editing
      });
      setFormErrors({});
      setOpenDialog(true);
   };

   const handleAddUser = () => {
      setSelectedUser(null);
      resetForm();
      setOpenDialog(true);
   };

   const handleCloseDialog = () => {
      setOpenDialog(false);
      setSelectedUser(null);
      resetForm();
   };

   const handleSaveUser = async () => {
      if (!validateForm()) return;

      try {
         setSaving(true);

         if (selectedUser) {
            // Edit existing user
            const updatedUser = await usersAPI.updateUser(selectedUser.id, {
               name: formData.name.trim(),
               email: formData.email.trim(),
               role: formData.role,
               active: formData.active,
            });
            setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
            setSnack({ open: true, message: "Usuário atualizado com sucesso", severity: "success" });
         } else {
            // Create new user
            const newUser = await usersAPI.createUser({
               name: formData.name.trim(),
               email: formData.email.trim(),
               phone: formData.phone?.trim() || undefined,
               role: formData.role,
               password: formData.password!,
               active: formData.active,
            });
            setUsers((prev) => [newUser, ...prev]);
            setSnack({ open: true, message: "Usuário criado com sucesso", severity: "success" });
         }

         handleCloseDialog();
      } catch (error: any) {
         setSnack({
            open: true,
            message: error?.response?.data?.message || "Erro ao salvar usuário",
            severity: "error",
         });
      } finally {
         setSaving(false);
      }
   };

   const handleDeleteUser = async (user: User) => {
      if (!window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) return;

      try {
         await usersAPI.deleteUser(user.id);
         setUsers((prev) => prev.filter((u) => u.id !== user.id));
         setSnack({ open: true, message: "Usuário excluído com sucesso", severity: "success" });
      } catch (error: any) {
         setSnack({
            open: true,
            message: error?.response?.data?.message || "Erro ao excluir usuário",
            severity: "error",
         });
      }
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
                     {users.filter((u) => u.active).length}
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
                     {users.filter((u) => !u.active).length}
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
                           <TableCell>Criado em</TableCell>
                           <TableCell align="center">Ações</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {loading ? (
                           <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                 <CircularProgress size={32} />
                              </TableCell>
                           </TableRow>
                        ) : users.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                 <Typography color="text.secondary">Nenhum usuário encontrado</Typography>
                              </TableCell>
                           </TableRow>
                        ) : (
                           users.map((user) => (
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
                                 <TableCell>{user.phone || "Não informado"}</TableCell>
                                 <TableCell>
                                    <Chip
                                       label={user.active ? "Ativo" : "Inativo"}
                                       color={user.active ? "success" : "default"}
                                       size="small"
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <Typography variant="body2">
                                       {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                                    </Typography>
                                 </TableCell>
                                 <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={() => handleEditUser(user)}>
                                       <Edit />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteUser(user)}>
                                       <Delete />
                                    </IconButton>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
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
                  <TextField
                     label="Nome Completo"
                     fullWidth
                     value={formData.name}
                     onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                     error={!!formErrors.name}
                     helperText={formErrors.name}
                  />
                  <TextField
                     label="Email"
                     type="email"
                     fullWidth
                     value={formData.email}
                     onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                     error={!!formErrors.email}
                     helperText={formErrors.email}
                  />
                  <TextField
                     label="Telefone"
                     fullWidth
                     value={formData.phone}
                     onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                  <FormControl fullWidth>
                     <InputLabel>Perfil</InputLabel>
                     <Select
                        value={formData.role}
                        label="Perfil"
                        onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as any }))}
                     >
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                        <MenuItem value="COZINHEIRA">Cozinheira</MenuItem>
                        <MenuItem value="RECEPCIONISTA">Recepcionista</MenuItem>
                     </Select>
                  </FormControl>
                  <FormControl fullWidth>
                     <InputLabel>Status</InputLabel>
                     <Select
                        value={formData.active ? "active" : "inactive"}
                        label="Status"
                        onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.value === "active" }))}
                     >
                        <MenuItem value="active">Ativo</MenuItem>
                        <MenuItem value="inactive">Inativo</MenuItem>
                     </Select>
                  </FormControl>
                  {!selectedUser && (
                     <TextField
                        label="Senha"
                        type="password"
                        fullWidth
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                     />
                  )}
               </Box>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleCloseDialog} disabled={saving}>
                  Cancelar
               </Button>
               <Button variant="contained" onClick={handleSaveUser} disabled={saving}>
                  {saving ? <CircularProgress size={20} /> : selectedUser ? "Salvar" : "Criar"}
               </Button>
            </DialogActions>
         </Dialog>

         {/* Snackbar para feedback */}
         <Snackbar
            open={snack.open}
            autoHideDuration={4000}
            onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
         >
            <Alert
               severity={snack.severity}
               variant="filled"
               onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
            >
               {snack.message}
            </Alert>
         </Snackbar>
      </Box>
   );
};

export default UsersPage;
