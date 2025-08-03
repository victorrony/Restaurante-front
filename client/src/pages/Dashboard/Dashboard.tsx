import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  Restaurant,
  ShoppingCart,
  TableBar,
  TrendingUp,
  People,
  AttachMoney,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Pedidos Hoje',
      value: '42',
      icon: <ShoppingCart />,
      color: '#f97316',
      change: '+12%',
    },
    {
      title: 'Mesas Ocupadas',
      value: '8/12',
      icon: <TableBar />,
      color: '#10b981',
      change: '67%',
    },
    {
      title: 'Faturamento',
      value: 'R$ 2.850',
      icon: <AttachMoney />,
      color: '#3b82f6',
      change: '+8%',
    },
    {
      title: 'Clientes',
      value: '156',
      icon: <People />,
      color: '#8b5cf6',
      change: '+15%',
    },
  ];

  const recentOrders = [
    { id: 'PED001', table: 'Mesa 5', status: 'Em preparação', time: '10 min' },
    { id: 'PED002', table: 'Mesa 2', status: 'Pronto', time: '2 min' },
    { id: 'PED003', table: 'Mesa 8', status: 'Pendente', time: '15 min' },
    { id: 'PED004', table: 'Mesa 1', status: 'Servido', time: '5 min' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return '#f59e0b';
      case 'Em preparação': return '#f97316';
      case 'Pronto': return '#10b981';
      case 'Servido': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Visão geral das operações do restaurante
      </Typography>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: stat.color, fontWeight: 'medium' }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      borderRadius: 2,
                      p: 2,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pedidos Recentes */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Pedidos Recentes
              </Typography>
              <Box>
                {recentOrders.map((order) => (
                  <Box
                    key={order.id}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={2}
                    borderBottom="1px solid #f0f0f0"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.table}
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          backgroundColor: `${getStatusColor(order.status)}20`,
                          color: getStatusColor(order.status),
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'medium',
                        }}
                      >
                        {order.status}
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {order.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status das Mesas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Status das Mesas
              </Typography>
              <Grid container spacing={1}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((table) => {
                  const status = Math.random() > 0.6 ? 'ocupada' : 'livre';
                  return (
                    <Grid item xs={4} key={table}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          backgroundColor: status === 'ocupada' ? '#fef3c7' : '#ecfdf5',
                          border: `1px solid ${status === 'ocupada' ? '#f59e0b' : '#10b981'}`,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {table}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: status === 'ocupada' ? '#f59e0b' : '#10b981',
                            fontWeight: 'medium',
                          }}
                        >
                          {status === 'ocupada' ? 'Ocupada' : 'Livre'}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
