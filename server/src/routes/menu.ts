import express from 'express';
import { auth, authorize } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

// @route   GET /api/menu
// @desc    Listar itens do menu
// @access  Public
router.get('/', async (req: any, res: any) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { available: true },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(menuItems);
  } catch (error) {
    console.error('Erro ao buscar menu:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/menu
// @desc    Criar item do menu
// @access  Private (Admin)
router.post('/', auth, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const { name, description, price, categoryId, preparationTime, ingredients } = req.body;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        categoryId,
        preparationTime
      },
      include: {
        category: true
      }
    });

    // Adicionar ingredientes se fornecidos
    if (ingredients && ingredients.length > 0) {
      await prisma.menuItemIngredient.createMany({
        data: ingredients.map((ing: any) => ({
          menuItemId: menuItem.id,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity
        }))
      });
    }

    res.status(201).json(menuItem);
  } catch (error) {
    console.error('Erro ao criar item do menu:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/menu/:id
// @desc    Atualizar item do menu
// @access  Private (Admin)
router.put('/:id', auth, authorize('ADMIN'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description, price, available, preparationTime } = req.body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price,
        available,
        preparationTime
      },
      include: {
        category: true
      }
    });

    res.json(menuItem);
  } catch (error) {
    console.error('Erro ao atualizar item do menu:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/menu/categories
// @desc    Listar categorias
// @access  Public
router.get('/categories', async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
