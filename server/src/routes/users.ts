import express from "express";
import { auth, authorize } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = express.Router();

// @route   GET /api/users
// @desc    Listar usuários
// @access  Private (Admin)
router.get("/", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const users = await prisma.user.findMany({
         select: {
            id: true,
            email: true,
            name: true,
            role: true,
            active: true,
            createdAt: true,
         },
         orderBy: { createdAt: "desc" },
      });

      res.json(users);
   } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   PUT /api/users/:id
// @desc    Atualizar usuário
// @access  Private (Admin)
router.put("/:id", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      const { name, email, role, active } = req.body;

      const user = await prisma.user.update({
         where: { id },
         data: { name, email, role, active },
         select: {
            id: true,
            email: true,
            name: true,
            role: true,
            active: true,
         },
      });

      res.json(user);
   } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   DELETE /api/users/:id
// @desc    Deletar usuário
// @access  Private (Admin)
router.delete("/:id", auth, authorize("ADMIN"), async (req: any, res: any) => {
   try {
      const { id } = req.params;

      await prisma.user.delete({
         where: { id },
      });

      res.json({ message: "Usuário deletado com sucesso" });
   } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
