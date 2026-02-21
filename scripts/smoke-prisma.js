const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.college.count();
  const first = await prisma.college.findMany({ take: 1, select: { id: true, name: true, slug: true } });
  console.log({ count, first });
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
