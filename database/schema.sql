-- Reference SQL (equivalent to prisma/schema.prisma). Normal setup uses `npx prisma migrate dev`.
CREATE TYPE "Status" AS ENUM ('Open', 'Closed');

CREATE TABLE "opportunities" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "researchArea" TEXT NOT NULL,
    "facultyName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "positions" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
