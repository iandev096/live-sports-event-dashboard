/**
 * User session management utilities
 * Generates and persists unique user IDs for simulation ownership
 */

const USER_ID_KEY = "live-sports-user-id";
const MATCH_ID_KEY = "live-sports-match-id";
const VIEWING_MODE_KEY = "live-sports-viewing-mode";
const ORIGINAL_OWNER_KEY = "live-sports-original-owner";

/**
 * Generate a unique user ID
 */
export const generateUserId = (): string => {
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Generate a unique match ID for a specific user
 * Match ID format: match-{userId}-{timestamp}-{random}
 */
export const generateMatchId = (userId: string): string => {
  return `match-${userId}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};

/**
 * Get or create user ID from localStorage
 */
export const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Get or create match ID from localStorage
 * Match ID is tied to the user ID
 */
export const getMatchId = (): string => {
  let matchId = localStorage.getItem(MATCH_ID_KEY);
  if (!matchId) {
    const userId = getUserId();
    matchId = generateMatchId(userId);
    localStorage.setItem(MATCH_ID_KEY, matchId);
  }
  return matchId;
};

/**
 * Clear match ID (for creating a new simulation)
 */
export const clearMatchId = (): void => {
  localStorage.removeItem(MATCH_ID_KEY);
};

/**
 * Set a specific match ID (for viewing another user's simulation)
 */
export const setMatchId = (matchId: string): void => {
  localStorage.setItem(MATCH_ID_KEY, matchId);
};

/**
 * Check if user owns the current match
 * Match ID format: match-{userId}-{timestamp}-{random}
 * userId format: user-{timestamp}-{random}
 */
export const isMatchOwner = (matchId: string, userId: string): boolean => {
  // Simply check if the match ID contains the user ID
  // Since match ID = "match-" + userId + "-" + timestamp + "-" + random
  // We can check if matchId includes the userId
  return matchId.includes(userId);
};

/**
 * Extract user ID from match ID
 * Match ID format: match-{userId}-{timestamp}-{random}
 * userId format: user-{timestamp}-{random}
 */
export const extractUserIdFromMatchId = (matchId: string): string | null => {
  // Remove "match-" prefix
  const withoutPrefix = matchId.replace(/^match-/, "");

  // The userId is everything before the last two dashes (which are timestamp and random)
  // Split by "-" and take the first 3 parts (user, timestamp, random from userId)
  const parts = withoutPrefix.split("-");
  if (parts.length < 5) return null; // Need at least: user, ts, rand, ts, rand

  // Reconstruct userId: user-{timestamp}-{random}
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
};

/**
 * Get viewing mode (owner or viewer)
 */
export const getViewingMode = (): "owner" | "viewer" => {
  return (
    (localStorage.getItem(VIEWING_MODE_KEY) as "owner" | "viewer") || "owner"
  );
};

/**
 * Set viewing mode
 */
export const setViewingMode = (mode: "owner" | "viewer"): void => {
  localStorage.setItem(VIEWING_MODE_KEY, mode);
};

/**
 * Create a shareable URL for a match
 */
export const createShareableUrl = (matchId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}?matchId=${encodeURIComponent(matchId)}&mode=viewer`;
};

/**
 * Parse match ID from URL
 */
export const getMatchIdFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("matchId");
};

/**
 * Check if URL indicates viewer mode
 */
export const isViewerModeFromUrl = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "viewer";
};

/**
 * Set the original owner of the current simulation
 * This prevents non-owners from accessing owner mode
 */
export const setOriginalOwner = (userId: string): void => {
  localStorage.setItem(ORIGINAL_OWNER_KEY, userId);
};

/**
 * Get the original owner of the current simulation
 */
export const getOriginalOwner = (): string | null => {
  return localStorage.getItem(ORIGINAL_OWNER_KEY);
};

/**
 * Clear the original owner (when resetting)
 */
export const clearOriginalOwner = (): void => {
  localStorage.removeItem(ORIGINAL_OWNER_KEY);
};

/**
 * Check if the current user is the original owner
 * This prevents viewers from hijacking simulations
 */
export const isCurrentUserOriginalOwner = (): boolean => {
  const currentUserId = getUserId();
  const originalOwner = getOriginalOwner();

  // If no original owner set, current user becomes the owner
  if (!originalOwner) {
    setOriginalOwner(currentUserId);
    return true;
  }

  return currentUserId === originalOwner;
};
