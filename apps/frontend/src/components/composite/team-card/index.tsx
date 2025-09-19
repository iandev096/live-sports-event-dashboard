import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  teamName: string;
  teamLogo?: string;
  teamScore: number;
  className?: string;
};

function TeamCard({
  teamName,
  teamLogo = "https://api.dicebear.com/7.x/identicon/svg?seed=Man",
  teamScore,
  className,
}: TeamCardProps) {
  return (
    <Card
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
        <div
          id="score"
          className="text-3xl @min-[220px]:text-4xl @min-[300px]:text-5xl font-bold"
        >
          {teamScore}
        </div>
      </CardContent>
    </Card>
  );
}

export default TeamCard;
