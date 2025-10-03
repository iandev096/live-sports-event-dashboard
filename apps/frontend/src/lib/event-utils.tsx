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
import type { TargetAndTransition, Transition } from "motion/react";

export const getEventIcon = (eventType: EventType) => {
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

export const getEventColor = (eventType: EventType) => {
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

export const getEventBadgeVariant = (eventType: EventType) => {
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

export const getEventTypeLabel = (eventType: EventType) => {
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

export const isImportantEvent = (eventType: EventType) => {
  return ["goal", "red-card", "penalty", "penalties"].includes(eventType);
};

export const getEventAnimation = (eventType: EventType) => {
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

export const getEventMotionProps = (
  eventType: EventType
): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
} => {
  const initial: TargetAndTransition = {};
  const animate: TargetAndTransition = {};
  const transition: Transition = {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  };

  switch (eventType) {
    case "goal":
      // Subtle goal celebration: gentle bounce
      Object.assign(initial, { opacity: 0, scale: 0.85, y: -15 });
      Object.assign(animate, {
        opacity: 1,
        scale: [0.85, 1.05, 1], // Gentle overshoot
        y: 0,
      });
      transition.duration = 0.5;
      transition.ease = [0.34, 1.2, 0.64, 1] as [
        number,
        number,
        number,
        number
      ];
      break;

    case "yellow-card":
      // Subtle shake for yellow card
      Object.assign(initial, { opacity: 0, x: -20, rotate: -3 });
      Object.assign(animate, {
        opacity: 1,
        x: [0, -4, 4, -2, 0], // Gentler shake
        rotate: 0,
      });
      transition.duration = 0.45;
      transition.ease = [0.25, 0.46, 0.45, 0.94] as [
        number,
        number,
        number,
        number
      ];
      break;

    case "red-card":
      // More noticeable shake for red card but still controlled
      Object.assign(initial, { opacity: 0, x: 20, scale: 0.9, rotate: 3 });
      Object.assign(animate, {
        opacity: [0, 1], // Remove flash
        x: [0, -6, 6, -3, 3, 0], // Moderate shake
        scale: [0.9, 1.03, 1], // Subtle impact
        rotate: 0,
      });
      transition.duration = 0.55;
      transition.ease = [0.25, 0.46, 0.45, 0.94] as [
        number,
        number,
        number,
        number
      ];
      break;

    case "penalty":
      // Special animation for penalty events
      Object.assign(initial, { opacity: 0, scale: 0.9, y: -10 });
      Object.assign(animate, {
        opacity: 1,
        scale: [0.9, 1.08, 1], // More pronounced bounce for penalties
        y: 0,
      });
      transition.duration = 0.6;
      transition.ease = [0.34, 1.2, 0.64, 1] as [
        number,
        number,
        number,
        number
      ];
      break;

    case "penalties":
      // Dramatic animation for penalty shootout
      Object.assign(initial, { opacity: 0, scale: 0.8, y: -20, rotate: -5 });
      Object.assign(animate, {
        opacity: 1,
        scale: [0.8, 1.1, 1], // Strong bounce
        y: 0,
        rotate: 0,
      });
      transition.duration = 0.7;
      transition.ease = [0.34, 1.2, 0.64, 1] as [
        number,
        number,
        number,
        number
      ];
      break;

    case "substitution":
      // Smooth slide-in for substitutions
      Object.assign(initial, { opacity: 0, x: -30, scale: 0.95 });
      Object.assign(animate, {
        opacity: 1,
        x: 0,
        scale: 1,
      });
      transition.duration = 0.4;
      break;

    case "shot":
      // Quick pop for shots
      Object.assign(initial, { opacity: 0, scale: 0.9, y: -10 });
      Object.assign(animate, {
        opacity: 1,
        scale: [0.9, 1.02, 1], // Quick pop
        y: 0,
      });
      transition.duration = 0.35;
      break;

    case "save":
      // Defensive save animation
      Object.assign(initial, { opacity: 0, scale: 0.95, y: 10 });
      Object.assign(animate, {
        opacity: 1,
        scale: [0.95, 1.03, 1], // Subtle defensive pop
        y: 0,
      });
      transition.duration = 0.4;
      break;

    default:
      // Standard smooth animation for regular events
      Object.assign(initial, { opacity: 0, y: -20, scale: 0.95 });
      Object.assign(animate, { opacity: 1, y: 0, scale: 1 });
      transition.duration = 0.4;
      break;
  }

  return { initial, animate, transition };
};
