import { Card, CardContent } from "@/components/ui/card";
import { type Poll, type PollOption } from "@/types";
import { useState } from "react";
import InactivePollState from "./inactive-poll-state";
import PollHeader from "./poll-header";
import PollResults from "./poll-results";
import VotingInterface from "./voting-interface";

type ActivePollProps = {
  poll: Poll;
  onVote?: (optionId: string) => void;
  hasVoted?: boolean;
  userVote?: string;
};

function ActivePoll({
  poll,
  onVote,
  hasVoted = false,
  userVote,
}: ActivePollProps) {
  const [selectedOption, setSelectedOption] = useState<string>(userVote || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async () => {
    if (!selectedOption || hasVoted) return;

    setIsSubmitting(true);
    try {
      await onVote?.(selectedOption);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
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

  if (!poll.isActive) {
    return <InactivePollState />;
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
}

export default ActivePoll;
