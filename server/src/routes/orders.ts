import express from 'express';
import { auth, authorize } from '../middleware/auth';
import prisma from '../lib/prisma';
import { io } from '../index';

const router = express.Router();

// @route   GET /api/orders
// @desc    Listar pedidos
// @access  Private
router.get('/', auth, async (req: any, res: any) => {
  try {
    const { status, tableId } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (tableId) where.tableId = tableId;

    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        user: {
          select: { name: true, email: true }
        },
        orderItems: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/orders
// @desc    Criar pedido
// @access  Private (Recepcionista, Admin)
router.post('/', auth, authorize('RECEPCIONISTA', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { tableId, items, notes } = req.body;
    
    // Gerar número do pedido
    const orderCount = await prisma.order.count();
    const orderNumber = `PED${String(orderCount + 1).padStart(4, '0')}`;

    // Calcular total
    let totalAmount = 0;
    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      });
      if (menuItem) {
        totalAmount += Number(menuItem.price) * item.quantity;
      }
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        tableId,
        userId: req.user.id,
        totalAmount,
        notes,
        orderItems: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        }
      },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Atualizar status da mesa
    await prisma.table.update({
      where: { id: tableId },
      data: { status: 'OCUPADA' }
    });

    // Notificar cozinha via Socket.IO
    io.to('kitchen').emit('newOrder', order);

    res.status(201).json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Atualizar status do pedido
// @access  Private (Cozinheira, Admin)
router.put('/:id/status', auth, authorize('COZINHEIRA', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    // Notificar recepção via Socket.IO
    if (status === 'PRONTO') {
      io.to('reception').emit('orderReady', order);
    }

    res.json(order);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/orders/:id/item/:itemId/status
// @desc    Atualizar status de item específico
// @access  Private (Cozinheira, Admin)
router.put('/:id/item/:itemId/status', auth, authorize('COZINHEIRA', 'ADMIN'), async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    const orderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
      include: {
        menuItem: true,
        order: {
          include: {
            table: true
          }
        }
      }
    });

    // Verificar se todos os itens estão prontos
    const allItems = await prisma.orderItem.findMany({
      where: { orderId: orderItem.orderId }
    });

    const allReady = allItems.every(item => item.status === 'PRONTO');
    
    if (allReady) {
      await prisma.order.update({
        where: { id: orderItem.orderId },
        data: { status: 'PRONTO' }
      });

      // Notificar recepção
      io.to('reception').emit('orderReady', orderItem.order);
    }

    res.json(orderItem);
  } catch (error) {
    console.error('Erro ao atualizar status do item:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
