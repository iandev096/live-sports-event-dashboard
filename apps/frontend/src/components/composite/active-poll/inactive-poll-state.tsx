import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

function InactivePollState() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 text-center">
        <div className="text-muted-foreground">
          <BarChart3 className="h-8 w-8 mx-auto mb-2" />
          <p>No active poll at the moment</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default InactivePollState;
