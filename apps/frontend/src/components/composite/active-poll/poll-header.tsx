import { CardHeader, CardTitle } from "@/components/ui/card";
import { type Poll } from "@/types";
import { BarChart3 } from "lucide-react";

type PollHeaderProps = {
  poll: Poll;
};

function PollHeader({ poll }: PollHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Active Poll
      </CardTitle>
      <p className="text-sm text-muted-foreground">{poll.question}</p>
    </CardHeader>
  );
}

export default PollHeader;
