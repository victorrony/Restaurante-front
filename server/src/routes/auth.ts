import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import prisma from "../lib/prisma";

import { Request, Response } from "express";

const router = express.Router();

// Validações
const loginValidation = [
   body("email").isEmail().withMessage("Email inválido"),
   body("password").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
];

const registerValidation = [
   body("email").isEmail().withMessage("Email inválido"),
   body("name").isLength({ min: 2 }).withMessage("Nome deve ter pelo menos 2 caracteres"),
   body("password").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
   body("role").isIn(["ADMIN", "RECEPCIONISTA", "COZINHEIRA"]).withMessage("Perfil inválido"),
];

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post("/login", loginValidation, async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
         where: { email },
         select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            active: true,
         },
      });

      if (!user || !user.active) {
         return res.status(400).json({
            message: "Credenciais inválidas ou usuário inativo",
         });
      }

      // Verificar senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({
            message: "Credenciais inválidas",
         });
      }

      // Gerar JWT
      const payload = {
         id: user.id,
         email: user.email,
         role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 60 * 60 * 24 * 7 });
      res.json({
         token,
         user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
         },
      });
   } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/auth/register
// @desc    Registro de usuário (apenas ADMIN)
// @access  Private
router.post("/register", registerValidation, async (req: Request, res: Response) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { email, name, password, role } = req.body;

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
         where: { email },
      });

      if (existingUser) {
         return res.status(400).json({
            message: "Usuário já existe com este email",
         });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar usuário
      const user = await prisma.user.create({
         data: {
            email,
            name,
            password: hashedPassword,
            role,
         },
         select: {
            id: true,
            email: true,
            name: true,
            role: true,
            active: true,
            createdAt: true,
         },
      });

      res.status(201).json({
         message: "Usuário criado com sucesso",
         user,
      });
   } catch (error) {
      console.error("Erro no registro:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get("/me", async (req, res) => {
   try {
      // Middleware de auth seria aplicado aqui
      res.json({ message: "Dados do usuário" });
   } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
