import express from "express";
import { auth, authorize } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = express.Router();

// @route   GET /api/menu
// @desc    Listar itens do menu (público: somente disponíveis; includeAll=true para admins)
// @access  Public
router.get("/", async (req: any, res: any) => {
   try {
      const rawIncludeAll = req.query.includeAll === "true" || req.query.includeAll === "1";
      // includeAll só permitido para ADMIN autenticado
      let includeAll = false;
      if (rawIncludeAll) {
         // tentar extrair usuário se houver token (uso leve do middleware manual)
         try {
            // reutilizar lógica? requer refator; aqui simplificamos exigindo header Authorization
            const authHeader = req.header("Authorization");
            if (authHeader?.startsWith("Bearer ")) {
               // Para não duplicar parsing complexo, simplesmente rejeitamos se não ADMIN via consulta simples
               const token = authHeader.replace("Bearer ", "");
               // evitar dependência circular: importar jwt localmente
               const jwt = require("jsonwebtoken");
               const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
               const user = await prisma.user.findUnique({
                  where: { id: decoded.id },
                  select: { role: true, active: true },
               });
               if (user && user.active && user.role === "ADMIN") {
                  includeAll = true;
               }
            }
         } catch (_) {
            // ignora, fallback includeAll = false
         }
      }

      const where: any = includeAll ? {} : { available: true };
      const menuItems = await prisma.menuItem.findMany({
         where,
         include: {
            category: true,
            ingredients: { include: { ingredient: true } },
         },
         orderBy: { name: "asc" },
      });
      res.json(menuItems);
   } catch (error) {
      console.error("Erro ao buscar menu:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/menu
// @desc    Criar item do menu
// @access  Private (Admin, Recepcionista)
router.post("/", auth, authorize("ADMIN", "RECEPCIONISTA"), async (req: any, res: any) => {
   try {
      let {
         name,
         description,
         price,
         categoryId,
         preparationTime,
         ingredients,
         available,
         image,
         isBase,
         isProteina,
         isAcompanhamento,
         isBebida,
      } = req.body;

      // Normalização
      name = typeof name === "string" ? name.trim() : "";
      description = typeof description === "string" ? description.trim() : undefined;

      // Validações
      if (!name) return res.status(400).json({ message: "Nome é obrigatório" });
      if (price == null || isNaN(Number(price)) || Number(price) <= 0)
         return res.status(400).json({ message: "Preço inválido" });
      if (!categoryId) return res.status(400).json({ message: "Categoria é obrigatória" });

      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || !category.active) return res.status(400).json({ message: "Categoria inválida" });

      if (preparationTime != null) {
         const pt = Number(preparationTime);
         if (isNaN(pt) || pt < 0) return res.status(400).json({ message: "Tempo de preparo inválido" });
         preparationTime = pt;
      }

      const created = await prisma.menuItem.create({
         data: {
            name,
            description,
            price: Number(price),
            categoryId,
            preparationTime: preparationTime ?? undefined,
            available: available !== false, // default true
            image: image?.trim() || undefined,
            // novos flags
            isBase: !!isBase,
            isProteina: !!isProteina,
            isAcompanhamento: !!isAcompanhamento,
            isBebida: !!isBebida,
         } as any,
         include: { category: true },
      });

      if (Array.isArray(ingredients) && ingredients.length > 0) {
         // Validação básica ingredientes
         const ingData = ingredients
            .filter((ing: any) => ing?.ingredientId && !isNaN(Number(ing.quantity)) && Number(ing.quantity) > 0)
            .map((ing: any) => ({
               menuItemId: created.id,
               ingredientId: ing.ingredientId,
               quantity: ing.quantity,
            }));
         if (ingData.length > 0) {
            await prisma.menuItemIngredient.createMany({ data: ingData });
         }
      }

      res.status(201).json(created);
   } catch (error) {
      console.error("Erro ao criar item do menu:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   PUT /api/menu/:id
// @desc    Atualizar item do menu
// @access  Private (Admin, Recepcionista)
router.put("/:id", auth, authorize("ADMIN", "RECEPCIONISTA"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      let {
         name,
         description,
         price,
         available,
         preparationTime,
         categoryId,
         image,
         isBase,
         isProteina,
         isAcompanhamento,
         isBebida,
      } = req.body;

      const existing = await prisma.menuItem.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ message: "Item não encontrado" });

      const data: any = {};
      if (name !== undefined) {
         name = typeof name === "string" ? name.trim() : "";
         if (!name) return res.status(400).json({ message: "Nome inválido" });
         data.name = name;
      }
      if (description !== undefined) {
         description = description?.trim() || undefined;
         data.description = description;
      }
      if (price !== undefined) {
         if (price == null || isNaN(Number(price)) || Number(price) <= 0)
            return res.status(400).json({ message: "Preço inválido" });
         data.price = Number(price);
      }
      if (available !== undefined) data.available = !!available;
      if (preparationTime !== undefined) {
         const pt = Number(preparationTime);
         if (isNaN(pt) || pt < 0) return res.status(400).json({ message: "Tempo de preparo inválido" });
         data.preparationTime = pt;
      }
      if (categoryId !== undefined) {
         const category = await prisma.category.findUnique({ where: { id: categoryId } });
         if (!category || !category.active) return res.status(400).json({ message: "Categoria inválida" });
         data.categoryId = categoryId;
      }
      if (image !== undefined) {
         image = image?.trim();
         data.image = image || undefined;
      }
      if (isBase !== undefined) data.isBase = !!isBase;
      if (isProteina !== undefined) data.isProteina = !!isProteina;
      if (isAcompanhamento !== undefined) data.isAcompanhamento = !!isAcompanhamento;
      if (isBebida !== undefined) data.isBebida = !!isBebida;

      const updated = await prisma.menuItem.update({
         where: { id },
         data: data as any,
         include: { category: true },
      });
      res.json(updated);
   } catch (error) {
      console.error("Erro ao atualizar item do menu:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   DELETE /api/menu/:id
// @desc    Remover item do menu
// @access  Private (Admin, Recepcionista)
router.delete("/:id", auth, authorize("ADMIN", "RECEPCIONISTA"), async (req: any, res: any) => {
   try {
      const { id } = req.params;
      // Verifica existência
      const exists = await prisma.menuItem.findUnique({ where: { id } });
      if (!exists) {
         return res.status(404).json({ message: "Item não encontrado" });
      }
      await prisma.menuItem.delete({ where: { id } });
      res.status(204).send();
   } catch (error) {
      console.error("Erro ao deletar item do menu:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   GET /api/menu/categories
// @desc    Listar categorias
// @access  Public
router.get("/categories", async (req: any, res: any) => {
   try {
      const categories = await prisma.category.findMany({
         where: { active: true },
         orderBy: { order: "asc" },
      });

      res.json(categories);
   } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/menu/categories
// @desc    Criar categoria
// @access  Private (Admin, Recepcionista)
router.post("/categories", auth, authorize("ADMIN", "RECEPCIONISTA"), async (req: any, res: any) => {
   try {
      const { name, description, order } = req.body;
      if (!name || !name.trim()) {
         return res.status(400).json({ message: "Nome da categoria é obrigatório" });
      }

      // Evitar duplicados ativos com mesmo nome (case-insensitive)
      const existing = await prisma.category.findFirst({
         where: { name: { equals: name.trim(), mode: "insensitive" }, active: true },
      });
      if (existing) {
         return res.status(409).json({ message: "Categoria já existe" });
      }

      const category = await prisma.category.create({
         data: {
            name: name.trim(),
            description: description?.trim() || undefined,
            order: typeof order === "number" ? order : undefined,
         },
      });

      res.status(201).json(category);
   } catch (error) {
      console.error("Erro ao criar categoria:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
