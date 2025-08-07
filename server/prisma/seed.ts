import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
   try {
      console.log("🌱 Iniciando seed do banco de dados...");

      // Criar usuário administrador padrão
      const adminPassword = await bcrypt.hash("admin123", 10);

      const admin = await prisma.user.upsert({
         where: { email: "admin@restaurante.com" },
         update: {
            password: adminPassword,
         },
         create: {
            email: "admin@restaurante.com",
            name: "Administrador",
            password: adminPassword,
            role: "ADMIN",
            active: true,
         },
      });

      // Criar recepcionista padrão
      const recepcionistaPassword = await bcrypt.hash("recepcao123", 10);

      const recepcionista = await prisma.user.upsert({
         where: { email: "recepcao@restaurante.com" },
         update: {
            password: recepcionistaPassword,
         },
         create: {
            email: "recepcao@restaurante.com",
            name: "Maria Silva",
            password: recepcionistaPassword,
            role: "RECEPCIONISTA",
            active: true,
         },
      });

      // Criar cozinheira padrão
      const cozinheiraPassword = await bcrypt.hash("cozinha123", 10);

      const cozinheira = await prisma.user.upsert({
         where: { email: "cozinha@restaurante.com" },
         update: {
            password: cozinheiraPassword,
         },
         create: {
            email: "cozinha@restaurante.com",
            name: "Ana Costa",
            password: cozinheiraPassword,
            role: "COZINHEIRA",
            active: true,
         },
      });

      // Criar algumas mesas
      const tables = await Promise.all([
         prisma.table.upsert({
            where: { number: 1 },
            update: {},
            create: {
               number: 1,
               capacity: 4,
               status: "LIVRE",
            },
         }),
         prisma.table.upsert({
            where: { number: 2 },
            update: {},
            create: {
               number: 2,
               capacity: 2,
               status: "LIVRE",
            },
         }),
         prisma.table.upsert({
            where: { number: 3 },
            update: {},
            create: {
               number: 3,
               capacity: 6,
               status: "LIVRE",
            },
         }),
         prisma.table.upsert({
            where: { number: 4 },
            update: {},
            create: {
               number: 4,
               capacity: 4,
               status: "LIVRE",
            },
         }),
         prisma.table.upsert({
            where: { number: 5 },
            update: {},
            create: {
               number: 5,
               capacity: 8,
               status: "LIVRE",
            },
         }),
      ]);

      console.log("✅ Seed concluído com sucesso!");
      console.log("\n👥 Usuários criados:");
      console.log(`📧 Admin: admin@restaurante.com (senha: admin123)`);
      console.log(`📧 Recepcionista: recepcao@restaurante.com (senha: recepcao123)`);
      console.log(`📧 Cozinheira: cozinha@restaurante.com (senha: cozinha123)`);
      console.log(`\n🪑 ${tables.length} mesas criadas`);
   } catch (error) {
      console.error("❌ Erro no seed:", error);
      throw error;
   } finally {
      await prisma.$disconnect();
   }
}

seed().catch((error) => {
   console.error(error);
   throw error;
});
