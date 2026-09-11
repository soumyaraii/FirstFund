/**
 * finalSummaryPrompt.js
 * ---------------------------------------------------------
 * Builds the prompt that generates the aiSummary object per
 * Person 1's locked contract:
 *   { biggestWin, biggestMistake, finalAnalysis }
 *
 * Folds in:
 *   - Feature 3: personality justification (merged INTO finalAnalysis,
 *                per the locked contract — no separate field)
 *   - Feature 4: full year-end narrative
 *
 * Person 1 determines `personality` (the label) using deterministic
 * rules on their side — we only explain WHY it fits.
 * ---------------------------------------------------------
 */

function buildFinalSummaryPrompt(payload) {
  const {
    totalScore,
    metrics,      // { emergencyReadiness, savingDiscipline, riskManagement, spendingDiscipline, investmentBehaviour }
    financials,   // { startingNetWorth, finalNetWorth, totalSavings, totalInvestments, emergencyFund, remainingDebt }
    trajectory,   // [{ month, netWorth }, ...]
    personality,  // string, already decided by Person 1's rules
    fullChoiceHistory
  } = payload;

  return `TASK_TYPE: FINAL_SUMMARY

You are writing the end-of-year summary for a financial-life simulation game.
The user has completed 12 months and their results are:

Total Score: ${totalScore}/100
Metrics: ${JSON.stringify(metrics)}
Financials: ${JSON.stringify(financials)}
Net worth trajectory across the year: ${JSON.stringify(trajectory)}
Assigned personality label (already decided, do not change it): "${personality}"
Full choice history: ${JSON.stringify(fullChoiceHistory)}

IMPORTANT: All currency values are in Indian Rupees. Always use the ₹ symbol
(never $ or "USD" or "dollars") when referencing any amount, and always
include the ₹ symbol — never write a bare number without it.

Respond with ONLY a valid JSON object (no markdown, no preamble) in exactly
this shape:
{
  {
  "biggestWin": "1 short human-readable phrase (NOT a tag name, NOT in caps) describing their strongest decision — e.g. 'Building an emergency fund early' not 'EMERGENCY_FUND'.",
  "biggestMistake": "1 short human-readable phrase (NOT a tag name, NOT in caps) describing their weakest decision — e.g. 'Taking on debt for a discretionary purchase' not 'TOOK_DEBT'.",
  "finalAnalysis": "3-4 sentences that (a) summarize their overall year and behavior pattern, (b) explain WHY the personality label '${personality}' fits their choices, and (c) end on a constructive, encouraging note. Never contradict or invent numbers beyond what's given above."
}`;
}

module.exports = { buildFinalSummaryPrompt };
