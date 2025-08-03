import React, { useState } from "react";
import {
   AppBar,
   Toolbar,
   Typography,
   Drawer,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   Box,
   IconButton,
   Badge,
   Menu,
   MenuItem,
   Avatar,
   Divider,
} from "@mui/material";
import {
   Menu as MenuIcon,
   Dashboard,
   Restaurant,
   ShoppingCart,
   TableBar,
   EventNote,
   Inventory,
   Assessment,
   People,
   Feedback,
   Settings,
   Logout,
   Notifications,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";

interface LayoutProps {
   children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const { user } = useSelector((state: RootState) => state.auth);

   const menuItems = [
      { text: "Dashboard", icon: <Dashboard />, path: "/dashboard", roles: ["ADMIN", "RECEPCIONISTA", "COZINHEIRA"] },
      { text: "Menu", icon: <Restaurant />, path: "/menu", roles: ["ADMIN", "RECEPCIONISTA"] },
      { text: "Pedidos", icon: <ShoppingCart />, path: "/orders", roles: ["ADMIN", "RECEPCIONISTA", "COZINHEIRA"] },
      { text: "Mesas", icon: <TableBar />, path: "/tables", roles: ["ADMIN", "RECEPCIONISTA"] },
      { text: "Reservas", icon: <EventNote />, path: "/reservations", roles: ["ADMIN", "RECEPCIONISTA"] },
      { text: "Estoque", icon: <Inventory />, path: "/inventory", roles: ["ADMIN", "COZINHEIRA"] },
      { text: "Relatórios", icon: <Assessment />, path: "/reports", roles: ["ADMIN"] },
      { text: "Usuários", icon: <People />, path: "/users", roles: ["ADMIN"] },
      { text: "Feedback", icon: <Feedback />, path: "/feedback", roles: ["ADMIN", "RECEPCIONISTA"] },
      { text: "Configurações", icon: <Settings />, path: "/settings", roles: ["ADMIN", "RECEPCIONISTA", "COZINHEIRA"] },
   ];

   const filteredMenuItems = menuItems.filter((item) => user?.role && item.roles.includes(user.role));

   const handleDrawerToggle = () => {
      setDrawerOpen(!drawerOpen);
   };

   const handleMenuClick = (path: string) => {
      navigate(path);
      setDrawerOpen(false);
   };

   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleProfileMenuClose = () => {
      setAnchorEl(null);
   };

   const handleLogout = () => {
      dispatch(logout());
      setAnchorEl(null);
   };

   const getRoleDisplayName = (role: string) => {
      switch (role) {
         case "ADMIN":
            return "👨‍💼 Administrador";
         case "RECEPCIONISTA":
            return "🧑‍💼 Recepcionista";
         case "COZINHEIRA":
            return "👨‍🍳 Cozinheira";
         default:
            return role;
      }
   };

   const drawer = (
      <Box>
         <Box p={2} bgcolor="primary.main" color="white">
            <Typography variant="h6" noWrap>
               🍽️ RestaurantePro
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
               {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
               {getRoleDisplayName(user?.role || "")}
            </Typography>
         </Box>
         <Divider />
         <List>
            {filteredMenuItems.map((item) => (
               <ListItem
                  button
                  key={item.text}
                  onClick={() => handleMenuClick(item.path)}
                  selected={location.pathname === item.path}
               >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
               </ListItem>
            ))}
         </List>
      </Box>
   );

   return (
      <Box sx={{ display: "flex" }}>
         <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  edge="start"
                  sx={{ mr: 2 }}
               >
                  <MenuIcon />
               </IconButton>

               <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                  Sistema de Gestão de Restaurante
               </Typography>

               <IconButton color="inherit">
                  <Badge badgeContent={4} color="error">
                     <Notifications />
                  </Badge>
               </IconButton>

               <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
               >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                     {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
               </IconButton>
            </Toolbar>
         </AppBar>

         <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
               keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
               "& .MuiDrawer-paper": { boxSizing: "border-box", width: 260 },
            }}
         >
            {drawer}
         </Drawer>

         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem onClick={() => navigate("/settings")}>
               <ListItemIcon>
                  <Settings fontSize="small" />
               </ListItemIcon>
               Configurações
            </MenuItem>
            <MenuItem onClick={handleLogout}>
               <ListItemIcon>
                  <Logout fontSize="small" />
               </ListItemIcon>
               Sair
            </MenuItem>
         </Menu>

         <Box
            component="main"
            sx={{
               flexGrow: 1,
               p: 3,
               mt: 8,
               minHeight: "100vh",
               bgcolor: "background.default",
            }}
         >
            {children}
         </Box>
      </Box>
   );
};

export default Layout;
