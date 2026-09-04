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
const CAUTIOUS_TAGS = ["SAVING_DISCIPLINE", "FRUGAL_HOUSING", "EMERGENCY_FUND", "AVOIDED_DEBT"];
const RISKY_TAGS = ["RISK_TAKING", "AGGRESSIVE_INVESTMENT", "SKIPPED_INSURANCE", "TOOK_DEBT"];

/**
 * @param {Array} choiceHistorySoFar
 * @returns {string} one-line pattern summary, or empty string if too little history
 */
function summarizePattern(choiceHistorySoFar = []) {
  if (!choiceHistorySoFar || choiceHistorySoFar.length < 2) {
    return ""; // not enough history yet to claim a pattern
  }

  const cautiousCount = choiceHistorySoFar.filter(c => CAUTIOUS_TAGS.includes(c.tag)).length;
  const riskyCount = choiceHistorySoFar.filter(c => RISKY_TAGS.includes(c.tag)).length;
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
