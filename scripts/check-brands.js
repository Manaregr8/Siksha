const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const brands = [
    "IIDAD",
    "NIHACS",
    "NIDADS",
    "NIGAPE",
    "DIZITALADDANIFASE",
    "DESIGNING VIDYA",
  ];

  const colleges = await prisma.college.findMany({
    where: { name: { in: brands } },
    select: {
      name: true,
      slug: true,
      _count: { select: { courses: true } },
    },
    orderBy: { name: "asc" },
  });

  const brand2yr = await prisma.course.count({
    where: { duration: 2, college: { name: { in: brands } } },
  });

  const brand3yr = await prisma.course.count({
    where: { duration: 3, college: { name: { in: brands } } },
  });

  // eslint-disable-next-line no-console
  console.log({ colleges, brand2yr, brand3yr });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
