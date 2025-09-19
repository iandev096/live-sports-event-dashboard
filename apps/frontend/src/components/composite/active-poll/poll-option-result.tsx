import { Progress } from "@/components/ui/progress";
import { type PollOption } from "@/types";
import { CheckCircle } from "lucide-react";

type PollOptionResultProps = {
  option: PollOption;
  percentage: number;
  voteCount: number;
  isUserVote: boolean;
};

function PollOptionResult({
  option,
  percentage,
  voteCount,
  isUserVote,
}: PollOptionResultProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${isUserVote ? "text-primary" : ""}`}>
          {option.text}
          {isUserVote && " (Your vote)"}
        </span>
        <span className="text-muted-foreground">
          {voteCount} votes ({percentage}%)
        </span>
      </div>

      <div className="relative">
        <Progress value={percentage} className="h-2" />
        {isUserVote && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}

export default PollOptionResult;
