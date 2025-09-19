import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type Poll } from "@repo/shared-types";

type VotingInterfaceProps = {
  poll: Poll;
  selectedOption: string;
  onOptionChange: (value: string) => void;
  onVote: () => void;
  isSubmitting: boolean;
};

function VotingInterface({
  poll,
  selectedOption,
  onOptionChange,
  onVote,
  isSubmitting,
}: VotingInterfaceProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedOption}
        onValueChange={onOptionChange}
        className="space-y-3"
      >
        {poll.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-3">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer text-sm font-medium"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={onVote}
        disabled={!selectedOption || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Vote"}
      </Button>
    </div>
  );
}

export default VotingInterface;
