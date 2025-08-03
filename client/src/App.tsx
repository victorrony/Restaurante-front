import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Components
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Auth/LoginPage';
import Dashboard from './pages/Dashboard/Dashboard';
import MenuPage from './pages/Menu/MenuPage';
import OrdersPage from './pages/Orders/OrdersPage';
import TablesPage from './pages/Tables/TablesPage';
import ReservationsPage from './pages/Reservations/ReservationsPage';
import InventoryPage from './pages/Inventory/InventoryPage';
import ReportsPage from './pages/Reports/ReportsPage';
import UsersPage from './pages/Users/UsersPage';
import FeedbackPage from './pages/Feedback/FeedbackPage';
import SettingsPage from './pages/Settings/SettingsPage';

// Types
import { RootState } from './store/store';

const App: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

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
        {(user?.role === 'ADMIN' || user?.role === 'COZINHEIRA') && (
          <Route path="/inventory" element={<InventoryPage />} />
        )}
        
        {user?.role === 'ADMIN' && (
          <>
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </>
        )}
        
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Redirect para dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
