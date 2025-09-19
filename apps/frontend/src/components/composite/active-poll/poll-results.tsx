import { Badge } from "@/components/ui/badge";
import { type Poll, type PollOption } from "@/types";
import { CheckCircle, Users } from "lucide-react";
import PollOptionResult from "./poll-option-result";

type PollResultsProps = {
  poll: Poll;
  userVote?: string;
  getOptionPercentage: (option: PollOption) => number;
  getOptionVoteCount: (option: PollOption) => number;
};

function PollResults({
  poll,
  userVote,
  getOptionPercentage,
  getOptionVoteCount,
}: PollResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{poll.totalVotes} total votes</span>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Voted
        </Badge>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = getOptionPercentage(option);
          const voteCount = getOptionVoteCount(option);
          const isUserVote = userVote === option.id;

          return (
            <PollOptionResult
              key={option.id}
              option={option}
              percentage={percentage}
              voteCount={voteCount}
              isUserVote={isUserVote}
            />
          );
        })}
      </div>
    </div>
  );
}

export default PollResults;
