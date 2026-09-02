import { db } from './firebase-client.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';

/**
 * Central JORON membership access helper.
 *
 * Client-side checks are for UX only. Sensitive operations must also be
 * protected by Firestore/Cloud Function rules on the server.
 */

const PLAN_RANK = Object.freeze({
  basic: 1,
  standard: 2,
  premium: 3,
  'premium plus': 4,
  premiumplus: 4,
});

function normalizePlan(plan) {
  return String(plan || '').trim().toLowerCase();
}

export function isActiveMember(member) {
  return !!member && member.membershipStatus === 'active';
}

export function getMembershipPlan(member) {
  return normalizePlan(member?.membershipPlan);
}

export function hasRequiredPlan(member, requiredPlan = 'basic') {
  if (!isActiveMember(member)) return false;
  const current = PLAN_RANK[getMembershipPlan(member)] || 0;
  const required = PLAN_RANK[normalizePlan(requiredPlan)] || 0;
  return current >= required;
}

export async function getMembershipAccess(uid) {
  if (!uid) {
    return {
      active: false,
      plan: '',
      member: null,
    };
  }

  const snap = await getDoc(doc(db, 'users', uid));
  const member = snap.exists() ? snap.data() : null;

  return {
    active: isActiveMember(member),
    plan: getMembershipPlan(member),
    member,
  };
}

export async function canUseMembership(uid, requiredPlan = 'basic') {
  const access = await getMembershipAccess(uid);
  return hasRequiredPlan(access.member, requiredPlan);
}

export async function requireMembership(uid, requiredPlan = 'basic') {
  const allowed = await canUseMembership(uid, requiredPlan);
  if (!allowed) {
    throw new Error('এই সুবিধাটি ব্যবহার করতে সক্রিয় Membership প্রয়োজন।');
  }
  return true;
}
