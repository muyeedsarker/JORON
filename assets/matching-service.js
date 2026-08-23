import { db } from "./firebase-client.js";
import { getDocs, collection, query, limit } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const clean = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";

export function calculateMatchScore(me, candidate) {
  let score = 0;
  let weight = 0;
  const checks = [
    ["district", 30],
    ["education", 20],
    ["profession", 15],
    ["marital", 15]
  ];

  for (const [key, points] of checks) {
    weight += points;
    if (clean(me?.[key]) && clean(candidate?.[key]) && clean(me[key]) === clean(candidate[key])) {
      score += points;
    }
  }

  if (Number(me?.age) && Number(candidate?.age)) {
    weight += 20;
    const difference = Math.abs(Number(me.age) - Number(candidate.age));
    if (difference <= 3) score += 20;
    else if (difference <= 7) score += 10;
  }

  return weight ? Math.round((score / weight) * 100) : 0;
}

export async function findMatches(currentUid, myProfile, maxProfiles = 100) {
  if (!currentUid) throw new Error("Authentication required");

  const snapshot = await getDocs(query(collection(db, "biodata"), limit(maxProfiles)));
  const matches = [];

  snapshot.forEach((item) => {
    if (item.id === currentUid) return;
    const profile = item.data() || {};
    matches.push({
      id: item.id,
      score: calculateMatchScore(myProfile, profile),
      age: profile.age ?? null,
      district: profile.district ?? null,
      education: profile.education ?? null,
      profession: profile.profession ?? null,
      marital: profile.marital ?? null
    });
  });

  return matches.sort((a, b) => b.score - a.score);
}
