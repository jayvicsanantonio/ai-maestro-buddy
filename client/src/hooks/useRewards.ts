import { useState, useCallback } from 'react';

export interface Badge {
  type: string;
  reason: string;
}

interface UseRewardsProps {
  onFeedbackChange: (text: string) => void;
}

export const useRewards = ({ onFeedbackChange }: UseRewardsProps) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadgeToReveal, setNewBadgeToReveal] =
    useState<Badge | null>(null);

  const rewardBadge = useCallback(
    (badgeType: string, badgeReason: string) => {
      onFeedbackChange(
        `🏆 BADGE EARNED: ${badgeType}! ${badgeReason}`
      );
      setBadges((prev) => [
        ...prev,
        { type: badgeType, reason: badgeReason },
      ]);
      setNewBadgeToReveal({ type: badgeType, reason: badgeReason });
    },
    [onFeedbackChange]
  );

  const closeReveal = useCallback(() => {
    setNewBadgeToReveal(null);
  }, []);

  return {
    badges,
    newBadgeToReveal,
    rewardBadge,
    closeReveal,
  };
};
