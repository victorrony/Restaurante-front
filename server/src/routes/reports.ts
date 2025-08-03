import express from 'express';
import { auth, authorize } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// @route   GET /api/reports/sales
// @desc    Relatório de vendas
// @access  Private (Admin)
router.get('/sales', auth, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const { startDate, endDate, period } = req.query;

    let start = new Date();
    let end = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else if (period === 'today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (period === 'week') {
      start.setDate(start.getDate() - 7);
    } else if (period === 'month') {
      start.setMonth(start.getMonth() - 1);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        status: {
          in: ['SERVIDO', 'PRONTO']
        }
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        payments: true
      }
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalOrders = orders.length;

    // Agrupar por item mais vendido
    const itemSales: any = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const key = item.menuItem.name;
        if (!itemSales[key]) {
          itemSales[key] = { quantity: 0, revenue: 0 };
        }
        itemSales[key].quantity += item.quantity;
        itemSales[key].revenue += Number(item.price) * item.quantity;
      });
    });

    const topItems = Object.entries(itemSales)
      .sort(([,a]: any, [,b]: any) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      period: { start, end },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      topItems,
      orders
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/reports/performance
// @desc    Relatório de desempenho
// @access  Private (Admin)
router.get('/performance', auth, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        orderItems: true,
        user: {
          select: { name: true, role: true }
        }
      }
    });

    // Calcular tempo médio de preparação
    const completedOrders = orders.filter(order => order.status === 'SERVIDO');
    const averagePreparationTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, order) => {
          const diff = order.updatedAt.getTime() - order.createdAt.getTime();
          return sum + (diff / 1000 / 60); // em minutos
        }, 0) / completedOrders.length
      : 0;

    // Performance por usuário
    const userPerformance: any = {};
    orders.forEach(order => {
      const userKey = order.user.name;
      if (!userPerformance[userKey]) {
        userPerformance[userKey] = {
          orders: 0,
          revenue: 0,
          role: order.user.role
        };
      }
      userPerformance[userKey].orders++;
      userPerformance[userKey].revenue += Number(order.totalAmount);
    });

    res.json({
      date: targetDate,
      summary: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        averagePreparationTime
      },
      userPerformance
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de desempenho:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/reports/inventory
// @desc    Relatório de inventário
// @access  Private (Admin)
router.get('/inventory', auth, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      include: {
        menuItems: {
          include: {
            menuItem: true
          }
        }
      }
    });

    const lowStock = ingredients.filter(ing => ing.stockQty <= ing.minStockQty);
    const totalValue = ingredients.reduce((sum, ing) => sum + (Number(ing.stockQty) * Number(ing.cost)), 0);

    res.json({
      totalIngredients: ingredients.length,
      lowStockCount: lowStock.length,
      totalInventoryValue: totalValue,
      ingredients,
      lowStockItems: lowStock
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de inventário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
