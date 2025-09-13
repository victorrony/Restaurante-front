import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Tab,
  Tabs,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Settings,
  Restaurant,
  Notifications,
  Security,
  Palette,
  Backup,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface RestaurantConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
  serviceCharge: number;
  taxRate: number;
  currency: string;
  language: string;
  timezone: string;
}

interface NotificationConfig {
  orderNotifications: boolean;
  kitchenNotifications: boolean;
  reservationNotifications: boolean;
  inventoryAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  pushNotifications: boolean;
}

interface SystemConfig {
  autoBackup: boolean;
  backupFrequency: string;
  dataRetentionDays: number;
  enableQRMenu: boolean;
  allowOnlineOrders: boolean;
  maxTablesPerOrder: number;
  sessionTimeout: number;
  enableTwoFactor: boolean;
}

const ConfigPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [resetDialog, setResetDialog] = useState(false);

  const [restaurantConfig, setRestaurantConfig] = useState<RestaurantConfig>({
    name: "Restaurante do Chef",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    email: "contato@restaurante.com",
    openingTime: "08:00",
    closingTime: "22:00",
    serviceCharge: 10,
    taxRate: 8.5,
    currency: "BRL",
    language: "pt-BR",
    timezone: "America/Sao_Paulo"
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    orderNotifications: true,
    kitchenNotifications: true,
    reservationNotifications: true,
    inventoryAlerts: true,
    emailNotifications: false,
    smsNotifications: false,
    soundEnabled: true,
    pushNotifications: true
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    autoBackup: true,
    backupFrequency: "daily",
    dataRetentionDays: 90,
    enableQRMenu: true,
    allowOnlineOrders: false,
    maxTablesPerOrder: 1,
    sessionTimeout: 480,
    enableTwoFactor: false
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSnackbar({ open: true, message: "Configurações salvas com sucesso!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao salvar configurações", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    setLoading(true);
    try {
      setRestaurantConfig({
        name: "Restaurante do Chef",
        address: "",
        phone: "",
        email: "",
        openingTime: "08:00",
        closingTime: "22:00",
        serviceCharge: 10,
        taxRate: 8.5,
        currency: "BRL",
        language: "pt-BR",
        timezone: "America/Sao_Paulo"
      });

      setNotificationConfig({
        orderNotifications: true,
        kitchenNotifications: true,
        reservationNotifications: true,
        inventoryAlerts: true,
        emailNotifications: false,
        smsNotifications: false,
        soundEnabled: true,
        pushNotifications: true
      });

      setSystemConfig({
        autoBackup: true,
        backupFrequency: "daily",
        dataRetentionDays: 90,
        enableQRMenu: true,
        allowOnlineOrders: false,
        maxTablesPerOrder: 1,
        sessionTimeout: 480,
        enableTwoFactor: false
      });

      setSnackbar({ open: true, message: "Configurações resetadas para padrão", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Erro ao resetar configurações", severity: "error" });
    } finally {
      setLoading(false);
      setResetDialog(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Settings sx={{ mr: 2, fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" component="h1">
          Configurações do Sistema
        </Typography>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<Restaurant />} label="Restaurante" />
          <Tab icon={<Notifications />} label="Notificações" />
          <Tab icon={<Security />} label="Sistema" />
          <Tab icon={<Palette />} label="Aparência" />
          <Tab icon={<Backup />} label="Backup" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações do Restaurante
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Informações Básicas" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nome do Restaurante"
                        value={restaurantConfig.name}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Endereço"
                        value={restaurantConfig.address}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, address: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={restaurantConfig.phone}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, phone: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="email"
                        label="E-mail"
                        value={restaurantConfig.email}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, email: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Horário de Funcionamento" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Horário de Abertura"
                        value={restaurantConfig.openingTime}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, openingTime: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="time"
                        label="Horário de Fechamento"
                        value={restaurantConfig.closingTime}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, closingTime: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Taxas e Valores" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Taxa de Serviço (%)"
                        value={restaurantConfig.serviceCharge}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, serviceCharge: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Taxa de Impostos (%)"
                        value={restaurantConfig.taxRate}
                        onChange={(e) => setRestaurantConfig({ ...restaurantConfig, taxRate: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Moeda</InputLabel>
                        <Select
                          value={restaurantConfig.currency}
                          onChange={(e) => setRestaurantConfig({ ...restaurantConfig, currency: e.target.value })}
                        >
                          <MenuItem value="BRL">Real (R$)</MenuItem>
                          <MenuItem value="USD">Dólar ($)</MenuItem>
                          <MenuItem value="EUR">Euro (€)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações de Notificações
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Notificações do Sistema" />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.orderNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, orderNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações de Pedidos"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.kitchenNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, kitchenNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações da Cozinha"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.reservationNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, reservationNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações de Reservas"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.inventoryAlerts}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, inventoryAlerts: e.target.checked })}
                      />
                    }
                    label="Alertas de Estoque"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Canais de Notificação" />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.pushNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, pushNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações Push"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.emailNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, emailNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações por E-mail"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.smsNotifications}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, smsNotifications: e.target.checked })}
                      />
                    }
                    label="Notificações por SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationConfig.soundEnabled}
                        onChange={(e) => setNotificationConfig({ ...notificationConfig, soundEnabled: e.target.checked })}
                      />
                    }
                    label="Som das Notificações"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações do Sistema
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Funcionalidades" />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemConfig.enableQRMenu}
                        onChange={(e) => setSystemConfig({ ...systemConfig, enableQRMenu: e.target.checked })}
                      />
                    }
                    label="Habilitar Menu QR Code"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemConfig.allowOnlineOrders}
                        onChange={(e) => setSystemConfig({ ...systemConfig, allowOnlineOrders: e.target.checked })}
                      />
                    }
                    label="Permitir Pedidos Online"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemConfig.enableTwoFactor}
                        onChange={(e) => setSystemConfig({ ...systemConfig, enableTwoFactor: e.target.checked })}
                      />
                    }
                    label="Autenticação de Dois Fatores"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Parâmetros do Sistema" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Máximo de Mesas por Pedido"
                        value={systemConfig.maxTablesPerOrder}
                        onChange={(e) => setSystemConfig({ ...systemConfig, maxTablesPerOrder: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Timeout da Sessão (minutos)"
                        value={systemConfig.sessionTimeout}
                        onChange={(e) => setSystemConfig({ ...systemConfig, sessionTimeout: Number(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Retenção de Dados (dias)"
                        value={systemConfig.dataRetentionDays}
                        onChange={(e) => setSystemConfig({ ...systemConfig, dataRetentionDays: Number(e.target.value) })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações de Aparência
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Idioma e Localização" />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Idioma</InputLabel>
                        <Select
                          value={restaurantConfig.language}
                          onChange={(e) => setRestaurantConfig({ ...restaurantConfig, language: e.target.value })}
                        >
                          <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                          <MenuItem value="en-US">English (US)</MenuItem>
                          <MenuItem value="es-ES">Español</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Fuso Horário</InputLabel>
                        <Select
                          value={restaurantConfig.timezone}
                          onChange={(e) => setRestaurantConfig({ ...restaurantConfig, timezone: e.target.value })}
                        >
                          <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
                          <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                          <MenuItem value="Europe/Madrid">Madrid (GMT+1)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Tema Visual" />
                <CardContent>
                  <Alert severity="info">
                    As configurações de tema serão implementadas em versões futuras.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Configurações de Backup
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Backup Automático" />
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemConfig.autoBackup}
                        onChange={(e) => setSystemConfig({ ...systemConfig, autoBackup: e.target.checked })}
                      />
                    }
                    label="Habilitar Backup Automático"
                  />
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Frequência</InputLabel>
                    <Select
                      value={systemConfig.backupFrequency}
                      onChange={(e) => setSystemConfig({ ...systemConfig, backupFrequency: e.target.value })}
                      disabled={!systemConfig.autoBackup}
                    >
                      <MenuItem value="hourly">A cada hora</MenuItem>
                      <MenuItem value="daily">Diário</MenuItem>
                      <MenuItem value="weekly">Semanal</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Backup Manual" />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Criar um backup manual do sistema incluindo dados e configurações.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Backup />}
                    fullWidth
                    onClick={() => setSnackbar({ open: true, message: "Backup iniciado!", severity: "success" })}
                  >
                    Criar Backup Agora
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSaveConfig}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : <Settings />}
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => setResetDialog(true)}
          disabled={loading}
        >
          Resetar para Padrão
        </Button>
      </Box>

      <Dialog open={resetDialog} onClose={() => setResetDialog(false)}>
        <DialogTitle>Confirmar Reset</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja resetar todas as configurações para os valores padrão?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)}>Cancelar</Button>
          <Button onClick={handleResetToDefaults} color="warning" disabled={loading}>
            {loading ? "Resetando..." : "Confirmar Reset"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfigPage;