/**
 * historyAnalyzer.js
 * ---------------------------------------------------------
 * Feature 5 — Pattern-Aware Explanations.
 *
 * Turns Person 1's `choiceHistorySoFar` array (tagged by
 * decision type) into a short plain-English summary the
 * prompt can reference, so explanations feel aware of the
 * user's behavior over time instead of judging each month
 * in isolation.
 *
 * Input shape (from Person 1):
 * [
 *   { month: 1, choiceId: "OPT_B", tag: "SAVING_DISCIPLINE" },
 *   { month: 2, choiceId: "OPT_A", tag: "FRUGAL_HOUSING" },
 *   { month: 3, choiceId: "OPT_C", tag: "SKIPPED_INSURANCE" }
 * ]
 * ---------------------------------------------------------
 */

// Broad buckets so patterns are readable even with varied tag names.
// NOTE: matched against the ACTUAL lowercase snake_case tags emitted by
// Person 1's scenarios array in server.js (e.g. "saving_discipline",
// "debt_trap") — not uppercase placeholder names. Comparison is also
// done case-insensitively below as a safety net against future tag
// naming changes.
const CAUTIOUS_TAGS = [
  "saving_discipline", "frugal_housing", "disciplined_investing",
  "delayed_gratification", "risk_protection", "spending_discipline",
  "goal_based_saving", "emergency_readiness", "emergency_buffer_used",
  "balanced_bonus", "balanced_growth", "cash_first"
];
const RISKY_TAGS = [
  "discretionary_splurge", "lifestyle_inflation", "debt_trap",
  "underinsured", "fomo_speculation", "lifestyle_spending",
  "future_debt", "bonus_splurge"
];

/**
 * @param {Array} choiceHistorySoFar
 * @returns {string} one-line pattern summary, or empty string if too little history
 */
function summarizePattern(choiceHistorySoFar = []) {
  if (!choiceHistorySoFar || choiceHistorySoFar.length < 2) {
    return ""; // not enough history yet to claim a pattern
  }

  // .toLowerCase() on both sides as defense-in-depth, in case tag casing
  // ever changes again on Person 1's side.
  const cautiousCount = choiceHistorySoFar.filter(c =>
    CAUTIOUS_TAGS.includes((c.tag || "").toLowerCase())
  ).length;
  const riskyCount = choiceHistorySoFar.filter(c =>
    RISKY_TAGS.includes((c.tag || "").toLowerCase())
  ).length;
  const total = choiceHistorySoFar.length;

  if (cautiousCount / total >= 0.6) {
    return `This user has leaned cautious/protective in ${cautiousCount} of their last ${total} decisions.`;
  }

  if (riskyCount / total >= 0.6) {
    return `This user has leaned toward higher-risk or lower-caution choices in ${riskyCount} of their last ${total} decisions.`;
  }

  return `This user's decisions so far have been mixed — no strong pattern yet.`;
}

module.exports = { summarizePattern };