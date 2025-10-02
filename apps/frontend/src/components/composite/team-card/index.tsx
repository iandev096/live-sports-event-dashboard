import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type TeamCardProps = {
  teamName: string;
  teamLogo?: string;
  teamScore: number;
  className?: string;
};

// Create motion-enhanced Card
const MotionCard = motion.create(Card);

function TeamCard({
  teamName,
  teamLogo = "https://api.dicebear.com/7.x/identicon/svg?seed=Man",
  teamScore,
  className,
}: TeamCardProps) {
  const [prevScore, setPrevScore] = useState(teamScore);
  const [isGoalAnimation, setIsGoalAnimation] = useState(false);

  // Detect when score changes (goal scored)
  useEffect(() => {
    if (teamScore > prevScore) {
      setIsGoalAnimation(true);
      setTimeout(() => setIsGoalAnimation(false), 4000); // Animation lasts 4 seconds
    }
    setPrevScore(teamScore);
  }, [teamScore, prevScore]);

  return (
    <MotionCard
      animate={
        isGoalAnimation
          ? {
              borderColor: [
                "transparent", // Start invisible
                "rgb(134, 239, 172)", // green-300
                "rgb(74, 222, 128)", // green-400
                "rgb(34, 197, 94)", // green-500 (brightest)
                "rgb(74, 222, 128)", // green-400
                "rgb(134, 239, 172)", // green-300
                "transparent", // Fade back to invisible
              ],
              borderWidth: [
                "0px", // Start with no border
                "2px",
                "3px",
                "4px", // Thickest at peak
                "3px",
                "2px",
                "0px", // Back to no border
              ],
            }
          : {
              borderColor: "transparent",
              borderWidth: "0px",
            }
      }
      transition={
        isGoalAnimation
          ? {
              duration: 4,
              times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
              ease: "easeInOut",
            }
          : { duration: 0 }
      }
      className={cn(
        "shadow-lg shadow-slate-200 dark:shadow-slate-800 @container",
        className
      )}
    >
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle
          className="text-lg @min-[220px]:text-xl @min-[300px]:text-2xl font-bold max-w-full truncate"
          title={teamName}
        >
          {teamName}
        </CardTitle>
        <Avatar className="size-16 @min-[220px]:size-18 @min-[300px]:size-20 drop-shadow-lg shadow-slate-900 dark:drop-shadow-slate-700">
          <AvatarImage src={teamLogo} />
          <AvatarFallback>
            {teamName
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center">
        <motion.div
          key={teamScore} // Re-render on score change
          id="score"
          className="text-3xl @min-[220px]:text-4xl @min-[300px]:text-5xl font-bold"
          initial={
            isGoalAnimation
              ? { scale: 0.5, opacity: 0, y: -20 }
              : { scale: 1, opacity: 1, y: 0 }
          }
          animate={
            isGoalAnimation
              ? {
                  scale: [0.5, 1.3, 1],
                  opacity: [0, 1, 1],
                  y: [-20, 0, 0],
                  color: [
                    "rgb(34, 197, 94)", // green-500
                    "rgb(34, 197, 94)",
                    "currentColor",
                  ],
                }
              : { scale: 1, opacity: 1, y: 0 }
          }
          transition={
            isGoalAnimation
              ? {
                  duration: 0.8,
                  times: [0, 0.6, 1],
                  ease: [0.34, 1.56, 0.64, 1], // easeOutBack
                }
              : { duration: 0 }
          }
        >
          {teamScore}
        </motion.div>
      </CardContent>
    </MotionCard>
  );
}

export default TeamCard;
