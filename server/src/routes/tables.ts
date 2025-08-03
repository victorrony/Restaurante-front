import express from "express";
import { auth, authorize } from "../middleware/auth";
import prisma from "../lib/prisma";
import QRCode from "qrcode";

const router = express.Router();

// @route   GET /api/tables
// @desc    Listar mesas
// @access  Private
router.get("/", auth, async (req: any, res: any) => {
   try {
      const tables = await prisma.table.findMany({
         orderBy: { number: "asc" },
         include: {
            orders: {
               where: {
                  status: {
                     in: ["PENDENTE", "EM_PREPARACAO", "PRONTO"],
                  },
               },
               include: {
                  orderItems: {
                     include: {
                        menuItem: true,
                     },
                  },
               },
            },
         },
      });

      res.json(tables);
   } catch (error) {
      console.error("Erro ao buscar mesas:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/tables
// @desc    Criar mesa
// @access  Private (Admin)
router.post("/", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const { number, capacity } = req.body;

      // Gerar QR Code
      const qrCodeData = JSON.stringify({
         tableNumber: number,
         restaurantId: "restaurant_id",
         menuUrl: `${process.env.FRONTEND_URL}/menu?table=${number}`,
      });

      const qrCode = await QRCode.toDataURL(qrCodeData);

      const table = await prisma.table.create({
         data: {
            number,
            capacity,
            qrCode,
         },
      });

      res.status(201).json(table);
   } catch (error) {
      console.error("Erro ao criar mesa:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   PUT /api/tables/:id/status
// @desc    Atualizar status da mesa
// @access  Private (Recepcionista, Admin)
router.put("/:id/status", auth, authorize("RECEPCIONISTA", "ADMIN"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      const table = await prisma.table.update({
         where: { id },
         data: { status },
      });

      res.json(table);
   } catch (error) {
      console.error("Erro ao atualizar status da mesa:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   GET /api/tables/:number/qr
// @desc    Obter QR Code da mesa
// @access  Public
router.get("/:number/qr", async (req: any, res: any) => {
   try {
      const { number } = req.params;

      const table = await prisma.table.findFirst({
         where: { number: parseInt(number) },
         select: { qrCode: true },
      });

      if (!table) {
         return res.status(404).json({ message: "Mesa não encontrada" });
      }

      res.json({ qrCode: table.qrCode });
   } catch (error) {
      console.error("Erro ao buscar QR Code:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
