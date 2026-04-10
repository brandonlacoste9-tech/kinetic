import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';

export interface LeaderboardEntry {
  rank: number;
  operatorName: string;
  intensityScore: number;
  sessions: number;
  sovereignSector: string | null;
  homeBase: string;
  isCurrentUser?: boolean;
}

export function useLeaderboard(sector?: string) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isContested, setIsContested] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockEntries: LeaderboardEntry[] = [
        { rank: 1, operatorName: "STRIKER_01", intensityScore: 9840, sessions: 142, sovereignSector: "Plateau", homeBase: "Hardknox" },
        { rank: 2, operatorName: "IRON_WILL", intensityScore: 9520, sessions: 128, sovereignSector: "Griffintown", homeBase: "B-Unit" },
        { rank: 3, operatorName: "CRINQUÉ_MTL", intensityScore: 9210, sessions: 115, sovereignSector: "Hochelaga", homeBase: "ProGym" },
        { rank: 4, operatorName: "GRIFFIN_KING", intensityScore: 8850, sessions: 94, sovereignSector: "Ville-Marie", homeBase: "Econofitness" },
        { rank: 5, operatorName: "PLATEAU_QUEEN", intensityScore: 8620, sessions: 88, sovereignSector: null, homeBase: "Victoria Park" },
        { rank: 6, operatorName: "THE_OPERATOR", intensityScore: 8400, sessions: 82, sovereignSector: null, homeBase: "Club Athlétique", isCurrentUser: true },
        { rank: 7, operatorName: "MILE_END_MAVEN", intensityScore: 8150, sessions: 76, sovereignSector: null, homeBase: "Ensō Yoga" },
        { rank: 8, operatorName: "SUD_OUEST_SOUL", intensityScore: 7920, sessions: 71, sovereignSector: null, homeBase: "Studio Lagree" },
      ];

      let filtered = mockEntries;
      if (sector) {
        if (sector === "Plateau") {
          filtered = [
            mockEntries[0],
            mockEntries[4],
            mockEntries[5],
          ];
        } else if (sector === "Griffintown") {
          filtered = [
            mockEntries[1],
            mockEntries[3],
            mockEntries[5],
          ];
        }
      }

      // Logic for "Contested": if top 2 are within 5% of each other
      if (filtered.length >= 2) {
        const top1 = filtered[0].intensityScore;
        const top2 = filtered[1].intensityScore;
        setIsContested((top1 - top2) / top1 < 0.05);
      } else {
        setIsContested(false);
      }

      setEntries(filtered);
      setLoading(false);
    }

    fetchLeaderboard();
  }, [sector]);

  return { entries, loading, isContested };
}
