import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Components
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/Auth/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import MenuPage from "./pages/Menu/MenuPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import TablesPage from "./pages/Tables/TablesPage";
import ReservationsPage from "./pages/Reservations/ReservationsPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import UsersPage from "./pages/Users/UsersPage";
import FeedbackPage from "./pages/Feedback/FeedbackPage";

// Types
import { RootState, AppDispatch } from "./store/store";
import { getCurrentUser } from "./store/slices/authSlice";
import ConfigPage from "./pages/Settings/Settings";

const App: React.FC = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);

   useEffect(() => {
      if (token && !user) {
         dispatch(getCurrentUser());
      }
   }, [token, user, dispatch]);

   if (!isAuthenticated) {
      return <LoginPage />;
   }

   return (
      <Layout>
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />

            {/* Rotas específicas por perfil */}
            {(user?.role === "ADMIN" || user?.role === "COZINHEIRA") && (
               <Route path="/inventory" element={<InventoryPage />} />
            )}

            {user?.role === "ADMIN" && (
               <>
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/users" element={<UsersPage />} />
               </>
            )}

            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<ConfigPage />} />

            {/* Redirect para dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
         </Routes>
      </Layout>
   );
};

export default App;
