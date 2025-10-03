import { Card, CardContent } from "@/components/ui/card";
import { type Poll, type PollOption } from "@/types";
import { memo, useState } from "react";
import PollHeader from "./poll-header";
import PollResults from "./poll-results";
import VotingInterface from "./voting-interface";

type ActivePollProps = {
  poll: Poll;
  onVote?: (optionId: string) => void;
  hasVoted?: boolean;
  userVote?: string;
};

const ActivePoll = memo(function ActivePoll({
  poll,
  onVote,
  hasVoted = false,
  userVote,
}: ActivePollProps) {
  const [selectedOption, setSelectedOption] = useState<string>(userVote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;

    setIsSubmitting(true);
    try {
      onVote?.(selectedOption);
      // Brief delay for UX feedback
      setTimeout(() => setIsSubmitting(false), 500);
    } catch (error) {
      console.error("Failed to vote:", error);
      setIsSubmitting(false);
    }
  };

  const getOptionPercentage = (option: PollOption) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((option.votes.length / poll.totalVotes) * 100);
  };

  const getOptionVoteCount = (option: PollOption) => {
    return option.votes.length;
  };

  // Show inactive state if poll ended
  if (!poll.isActive) {
    return (
      <Card className="w-full">
        <PollHeader poll={poll} />
        <CardContent className="space-y-4">
          <PollResults
            poll={poll}
            userVote={userVote}
            getOptionPercentage={getOptionPercentage}
            getOptionVoteCount={getOptionVoteCount}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <PollHeader poll={poll} />
      <CardContent className="space-y-4">
        {!hasVoted ? (
          <VotingInterface
            poll={poll}
            selectedOption={selectedOption}
            onOptionChange={setSelectedOption}
            onVote={handleVote}
            isSubmitting={isSubmitting}
          />
        ) : (
          <PollResults
            poll={poll}
            userVote={userVote}
            getOptionPercentage={getOptionPercentage}
            getOptionVoteCount={getOptionVoteCount}
          />
        )}
      </CardContent>
    </Card>
  );
});

export default ActivePoll;
