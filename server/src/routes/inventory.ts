import express from "express";
import { auth, authorize } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = express.Router();

// @route   GET /api/inventory
// @desc    Listar ingredientes do estoque
// @access  Private (Admin, Cozinheira)
router.get("/", auth, authorize("ADMIN", "COZINHEIRA"), async (req: any, res: any) => {
   try {
      const ingredients = await prisma.ingredient.findMany({
         orderBy: { name: "asc" },
      });

      // Identificar ingredientes com estoque baixo
      const lowStockIngredients = ingredients.filter((ingredient) => ingredient.stockQty <= ingredient.minStockQty);

      res.json({
         ingredients,
         lowStockCount: lowStockIngredients.length,
         lowStockIngredients,
      });
   } catch (error) {
      console.error("Erro ao buscar estoque:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/inventory
// @desc    Criar ingrediente
// @access  Private (Admin)
router.post("/", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const { name, unit, stockQty, minStockQty, cost } = req.body;

      const ingredient = await prisma.ingredient.create({
         data: {
            name,
            unit,
            stockQty,
            minStockQty,
            cost,
         },
      });

      res.status(201).json(ingredient);
   } catch (error) {
      console.error("Erro ao criar ingrediente:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   PUT /api/inventory/:id
// @desc    Atualizar ingrediente
// @access  Private (Admin)
router.put("/:id", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      const { name, unit, stockQty, minStockQty, cost } = req.body;

      const ingredient = await prisma.ingredient.update({
         where: { id },
         data: {
            name,
            unit,
            stockQty,
            minStockQty,
            cost,
         },
      });

      res.json(ingredient);
   } catch (error) {
      console.error("Erro ao atualizar ingrediente:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   PUT /api/inventory/:id/stock
// @desc    Atualizar estoque do ingrediente
// @access  Private (Admin, Cozinheira)
router.put("/:id/stock", auth, authorize("ADMIN", "COZINHEIRA"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

      const ingredient = await prisma.ingredient.findUnique({
         where: { id },
      });

      if (!ingredient) {
         return res.status(404).json({ message: "Ingrediente não encontrado" });
      }

      let newStockQty;
      if (operation === "add") {
         newStockQty = Number(ingredient.stockQty) + Number(quantity);
      } else {
         newStockQty = Number(ingredient.stockQty) - Number(quantity);
      }

      if (newStockQty < 0) {
         return res.status(400).json({ message: "Estoque não pode ser negativo" });
      }

      const updatedIngredient = await prisma.ingredient.update({
         where: { id },
         data: { stockQty: newStockQty },
      });

      res.json(updatedIngredient);
   } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   GET /api/inventory/low-stock
// @desc    Listar ingredientes com estoque baixo
// @access  Private (Admin, Cozinheira)
router.get("/low-stock", auth, authorize("ADMIN", "COZINHEIRA"), async (req: any, res: any) => {
   try {
      const ingredients = await prisma.ingredient.findMany({
         where: {
            stockQty: {
               lte: prisma.ingredient.fields.minStockQty,
            },
         },
         orderBy: { stockQty: "asc" },
      });

      res.json(ingredients);
   } catch (error) {
      console.error("Erro ao buscar ingredientes com estoque baixo:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
