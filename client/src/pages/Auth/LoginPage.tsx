import React, { useState } from "react";
import {
   Box,   
   TextField,
   Button,
   Typography,
   Alert,
   CircularProgress,
   Container,
   Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { login } from "../../store/slices/authSlice";

const LoginPage: React.FC = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const dispatch = useDispatch();
   const { loading, error } = useSelector((state: RootState) => state.auth);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(login({ email, password }) as any);
   };

   return (
      <Container maxWidth="sm">
         <Box
            sx={{
               minHeight: "100vh",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            }}
         >
            <Paper
               elevation={24}
               sx={{
                  p: 4,
                  borderRadius: 4,
                  width: "100%",
                  maxWidth: 400,
               }}
            >
               <Box textAlign="center" mb={4}>
                  <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                     🍽️ RestaurantePro
                  </Typography>
                  <Typography variant="h6" color="text.secondary" mt={1}>
                     Sistema de Gestão de Restaurante
                  </Typography>
               </Box>

               {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                     {error}
                  </Alert>
               )}

               <form onSubmit={handleSubmit}>
                  <TextField
                     fullWidth
                     label="Email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     margin="normal"
                     required
                     variant="outlined"
                     placeholder="usuario@restaurante.com"
                  />

                  <TextField
                     fullWidth
                     label="Senha"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     margin="normal"
                     required
                     variant="outlined"
                     placeholder="••••••••"
                  />

                  <Button
                     type="submit"
                     fullWidth
                     variant="contained"
                     size="large"
                     disabled={loading}
                     sx={{ mt: 3, mb: 2, py: 1.5 }}
                  >
                     {loading ? <CircularProgress size={24} /> : "Entrar"}
                  </Button>
               </form>

               <Box mt={4}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                     Usuários de demonstração:
                  </Typography>
                  <Box mt={2} display="flex" flexDirection="column" gap={1}>
                     <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                           setEmail("admin@restaurante.com");
                           setPassword("123456");
                        }}
                     >
                        👨‍💼 Admin
                     </Button>
                     <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                           setEmail("recepcionista@restaurante.com");
                           setPassword("123456");
                        }}
                     >
                        🧑‍💼 Recepcionista
                     </Button>
                     <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                           setEmail("cozinheira@restaurante.com");
                           setPassword("123456");
                        }}
                     >
                        👨‍🍳 Cozinheira
                     </Button>
                  </Box>
               </Box>
            </Paper>
         </Box>
      </Container>
   );
};

export default LoginPage;
