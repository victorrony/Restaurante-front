import express from "express";
import { auth } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = express.Router();

// @route   GET /api/feedback
// @desc    Listar feedbacks
// @access  Private (Admin)
router.get("/", auth, async (req: any, res: any) => {
   try {
      const feedbacks = await prisma.feedback.findMany({
         include: {
            user: {
               select: { name: true, email: true },
            },
         },
         orderBy: { createdAt: "desc" },
      });

      // Calcular estatísticas
      const totalFeedbacks = feedbacks.length;
      const averageRating =
         totalFeedbacks > 0
            ? feedbacks.reduce((sum: number, feedback: any) => sum + feedback.rating, 0) / totalFeedbacks
            : 0;

      const averageServiceRating =
         feedbacks.filter((f: any) => f.serviceRating).length > 0
            ? feedbacks.filter((f: any) => f.serviceRating).reduce((sum: number, f: any) => sum + f.serviceRating, 0) /
              feedbacks.filter((f: any) => f.serviceRating).length
            : 0;

      const averageFoodRating =
         feedbacks.filter((f: any) => f.foodRating).length > 0
            ? feedbacks.filter((f: any) => f.foodRating).reduce((sum: number, f: any) => sum + f.foodRating, 0) /
              feedbacks.filter((f: any) => f.foodRating).length
            : 0;

      res.json({
         feedbacks,
         statistics: {
            total: totalFeedbacks,
            averageRating: Number(averageRating.toFixed(1)),
            averageServiceRating: Number(averageServiceRating.toFixed(1)),
            averageFoodRating: Number(averageFoodRating.toFixed(1)),
         },
      });
   } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   POST /api/feedback
// @desc    Criar feedback
// @access  Public/Private
router.post("/", async (req: any, res: any) => {
   try {
      const { rating, comment, serviceRating, foodRating, userId } = req.body;

      const feedback = await prisma.feedback.create({
         data: {
            rating,
            comment,
            serviceRating,
            foodRating,
            userId: userId || null,
         },
      });

      res.status(201).json(feedback);
   } catch (error) {
      console.error("Erro ao criar feedback:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

// @route   GET /api/feedback/statistics
// @desc    Estatísticas de feedback
// @access  Private (Admin)
router.get("/statistics", auth, async (req: any, res: any) => {
   try {
      const { period } = req.query;

      let startDate = new Date();
      if (period === "week") {
         startDate.setDate(startDate.getDate() - 7);
      } else if (period === "month") {
         startDate.setMonth(startDate.getMonth() - 1);
      } else if (period === "year") {
         startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const feedbacks = await prisma.feedback.findMany({
         where: {
            createdAt: {
               gte: startDate,
            },
         },
      });

      // Distribuição por rating
      const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
         rating,
         count: feedbacks.filter((f: any) => f.rating === rating).length,
      }));

      const totalFeedbacks = feedbacks.length;
      const positiveRating = feedbacks.filter((f: any) => f.rating >= 4).length;
      const negativeRating = feedbacks.filter((f: any) => f.rating <= 2).length;

      res.json({
         totalFeedbacks,
         positivePercentage: totalFeedbacks > 0 ? ((positiveRating / totalFeedbacks) * 100).toFixed(1) : 0,
         negativePercentage: totalFeedbacks > 0 ? ((negativeRating / totalFeedbacks) * 100).toFixed(1) : 0,
         ratingDistribution,
      });
   } catch (error) {
      console.error("Erro ao buscar estatísticas de feedback:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
   }
});

export default router;
