import express from 'express';
import { auth, authorize } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// @route   GET /api/reservations
// @desc    Listar reservas
// @access  Private
router.get('/', auth, async (req: any, res: any) => {
  try {
    const { date, status } = req.query;
    
    const where: any = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.date = {
        gte: startDate,
        lt: endDate
      };
    }
    if (status) where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        table: true,
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/reservations
// @desc    Criar reserva
// @access  Private (Recepcionista, Admin)
router.post('/', auth, authorize('RECEPCIONISTA', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { 
      date, 
      time, 
      guests, 
      customerName, 
      customerPhone, 
      customerEmail, 
      tableId,
      notes 
    } = req.body;

    // Verificar se a mesa está disponível no horário
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tableId,
        date: new Date(date),
        time,
        status: 'CONFIRMADA'
      }
    });

    if (existingReservation) {
      return res.status(400).json({
        message: 'Mesa já reservada para este horário'
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        date: new Date(date),
        time,
        guests,
        customerName,
        customerPhone,
        customerEmail,
        tableId,
        userId: req.user.id,
        notes
      },
      include: {
        table: true
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/reservations/:id/status
// @desc    Atualizar status da reserva
// @access  Private (Recepcionista, Admin)
router.put('/:id/status', auth, authorize('RECEPCIONISTA', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        table: true
      }
    });

    // Se a reserva foi confirmada, marcar mesa como reservada
    if (status === 'CONFIRMADA') {
      await prisma.table.update({
        where: { id: reservation.tableId },
        data: { status: 'RESERVADA' }
      });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Erro ao atualizar status da reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/reservations/availability
// @desc    Verificar disponibilidade de mesas
// @access  Public
router.get('/availability', async (req: any, res: any) => {
  try {
    const { date, time, guests } = req.query;

    // Buscar mesas disponíveis
    const availableTables = await prisma.table.findMany({
      where: {
        capacity: {
          gte: parseInt(guests)
        },
        reservations: {
          none: {
            date: new Date(date),
            time,
            status: 'CONFIRMADA'
          }
        }
      },
      orderBy: { capacity: 'asc' }
    });

    res.json(availableTables);
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
