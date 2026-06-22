import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding...');

  await prisma.purchase.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
    },
  });

  const drop = await prisma.drop.create({
    data: {
      title: 'Nike Dunk Low Panda',
      description: 'Limited sneaker drop',
      totalStock: 100,
      availableStock: 100,
      status: 'ACTIVE',
      startsAt: new Date(Date.now() - 3600_000),
      endsAt: new Date(Date.now() + 86_400_000),
    },
  });

  const reservation = await prisma.reservation.create({
    data: {
      userId: user.id,
      dropId: drop.id,
      status: 'COMPLETED',
      expiresAt: new Date(Date.now() + 10 * 60_000),
      completedAt: new Date(),
    },
  });

  await prisma.purchase.create({
    data: {
      userId: user.id,
      dropId: drop.id,
      reservationId: reservation.id,
      quantity: 1,
      amount: 199.99,
    },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });