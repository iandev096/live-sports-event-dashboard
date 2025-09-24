import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables from root .env file
dotenv.config({ path: "../../.env" });

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a sample match
  const match = await prisma.match.create({
    data: {
      teamA: "Manchester United",
      teamB: "Liverpool",
      scoreA: 0,
      scoreB: 0,
      status: "SCHEDULED",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    },
  });

  // Create a sample poll for the match
  const poll = await prisma.poll.create({
    data: {
      question: "Who will win this match?",
      matchId: match.id,
      isActive: true,
      options: {
        create: [
          { text: match.teamA },
          { text: match.teamB },
          { text: "Draw" },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Created match: ${match.teamA} vs ${match.teamB}`);
  console.log(`📝 Created poll: ${poll.question}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
