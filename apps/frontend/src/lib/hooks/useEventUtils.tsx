import type { EventType } from "@/types";
import {
  Clock,
  Flag,
  Goal,
  MessageSquare,
  Play,
  Shield,
  Square,
  Target,
  Users,
  Zap,
} from "lucide-react";

export const useEventUtils = () => {
  const getEventIcon = (eventType: EventType) => {
    switch (eventType) {
      case "goal":
        return <Goal className="h-4 w-4 text-green-600" />;
      case "yellow-card":
        return <Square fill="#eab308" className="h-4 w-4 text-yellow-500" />;
      case "red-card":
        return <Square fill="#dc2626" className="h-4 w-4 text-red-600" />;
      case "substitution":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "shot":
        return <Target className="h-4 w-4 text-orange-500" />;
      case "save":
        return <Shield className="h-4 w-4 text-purple-600" />;
      case "corner":
        return <Flag className="h-4 w-4 text-indigo-500" />;
      case "free-kick":
      case "penalty":
        return <Zap className="h-4 w-4 text-yellow-600" />;
      case "penalties":
        return <Target className="h-4 w-4 text-red-600" />;
      case "kickoff":
      case "half-time":
      case "full-time":
      case "extra-time":
        return <Play className="h-4 w-4 text-gray-600" />;
      case "commentary":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = (eventType: EventType) => {
    switch (eventType) {
      case "goal":
        return "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "yellow-card":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "red-card":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "substitution":
        return "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "shot":
        return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "save":
        return "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "corner":
        return "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "free-kick":
      case "penalty":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "penalties":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "kickoff":
      case "half-time":
      case "full-time":
      case "extra-time":
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      case "commentary":
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-slate-900 dark:to-slate-800 dark:border-slate-700";
    }
  };

  const getEventBadgeVariant = (eventType: EventType) => {
    switch (eventType) {
      case "goal":
        return "default";
      case "yellow-card":
        return "secondary";
      case "red-card":
        return "destructive";
      case "substitution":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getEventTypeLabel = (eventType: EventType) => {
    switch (eventType) {
      case "yellow-card":
        return "YELLOW CARD";
      case "red-card":
        return "RED CARD";
      case "free-kick":
        return "FREE KICK";
      case "half-time":
        return "HALF TIME";
      case "full-time":
        return "FULL TIME";
      case "extra-time":
        return "EXTRA TIME";
      default:
        return eventType.replace("-", " ").toUpperCase();
    }
  };

  const isImportantEvent = (eventType: EventType) => {
    return ["goal", "red-card", "penalty", "penalties"].includes(eventType);
  };

  const getEventAnimation = (eventType: EventType) => {
    if (isImportantEvent(eventType)) {
      switch (eventType) {
        case "goal":
          return "animate-event-glow-goal";
        case "red-card":
          return "animate-event-glow-red-card";
        case "penalty":
          return "animate-event-glow-penalty";
        case "penalties":
          return "animate-event-glow-penalties";
        default:
          return "animate-event-highlight";
      }
    }
    return "";
  };

  return {
    getEventIcon,
    getEventColor,
    getEventBadgeVariant,
    getEventTypeLabel,
    isImportantEvent,
    getEventAnimation,
  };
};
