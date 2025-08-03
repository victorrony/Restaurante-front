import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import tableRoutes from './routes/tables';
import reservationRoutes from './routes/reservations';
import inventoryRoutes from './routes/inventory';
import reportsRoutes from './routes/reports';
import feedbackRoutes from './routes/feedback';

// Middleware
import { errorHandler } from './middleware/errorHandler';
import { socketAuth } from './middleware/socketAuth';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO
io.use(socketAuth);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Cliente ${socket.id} entrou na sala ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Export io instance for use in other modules
export { io };

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});

export default app;
