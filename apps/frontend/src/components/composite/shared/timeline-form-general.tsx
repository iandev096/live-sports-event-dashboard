import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import { type TimelineFormData } from "./timeline-form-types";

interface TimelineFormGeneralProps {
  form: UseFormReturn<TimelineFormData>;
}

// Desktop version
function DesktopTimelineFormGeneral({ form }: TimelineFormGeneralProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="teamA"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team A</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Team A name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="teamB"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team B</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Team B name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="matchType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Match Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Standard (90 min)</SelectItem>
                <SelectItem value="extra-time">Extra Time (120 min)</SelectItem>
                <SelectItem value="penalties">Penalties (125 min)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Mobile version
function MobileTimelineFormGeneral({ form }: TimelineFormGeneralProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="teamA"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team A</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Team A name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="teamB"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Team B</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Team B name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="matchType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Match Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Standard (90 min)</SelectItem>
                <SelectItem value="extra-time">Extra Time (120 min)</SelectItem>
                <SelectItem value="penalties">Penalties (125 min)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// Compound component
export const TimelineFormGeneral = {
  Desktop: DesktopTimelineFormGeneral,
  Mobile: MobileTimelineFormGeneral,
};
