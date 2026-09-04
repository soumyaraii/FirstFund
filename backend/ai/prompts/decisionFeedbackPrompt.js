/**
 * decisionFeedbackPrompt.js
 * ---------------------------------------------------------
 * Builds the single prompt that generates the ENTIRE aiFeedback
 * object per Person 1's locked contract:
 *   { explanation, lesson, alternativeComparison, forwardTip }
 *
 * Folds in:
 *   - Feature 1: consequence explanation
 *   - Feature 2: alternative comparison
 *   - Feature 5: pattern-aware context (via historySummary)
 *   - Feature 6: severity-based tone (via toneInstruction)
 *   - Feature 7: best/worst case spectrum (months 6 & 7 only,
 *                when alternativePaths is present)
 *   - Feature 8: forward-looking tip
 * ---------------------------------------------------------
 */

const { getToneInstruction } = require("../utils/toneMatcher");
const { summarizePattern } = require("../utils/historyAnalyzer");

/**
 * @param {Object} payload - everything Person 1 sends per decision
 *   {
 *     month, scenario, choice,
 *     previousState, newState,
 *     immediateImpact, projected12MonthImpact,
 *     choiceHistorySoFar,
 *     alternativePaths   // only present on months 6 & 7
 *   }
 * @returns {string} the user-prompt text to send to the model
 */
function buildDecisionFeedbackPrompt(payload) {
  const {
    month,
    scenario,
    choice,
    previousState,
    newState,
    immediateImpact,
    projected12MonthImpact,
    choiceHistorySoFar,
    alternativePaths
  } = payload;

  const toneInstruction = getToneInstruction(projected12MonthImpact?.netWorthDelta ?? immediateImpact?.netWorthDelta ?? 0);
  const patternSummary = summarizePattern(choiceHistorySoFar);

  const spectrumSection = alternativePaths
    ? `
This is a pivotal month. In addition to the standard comparison, here is the
range of possible outcomes:
${alternativePaths.map(p => `- ${p.label}: net worth ₹${p.netWorth}`).join("\n")}
When writing "alternativeComparison", reference this range (safest vs riskiest)
rather than just a single alternative.`
    : "";

  return `TASK_TYPE: DECISION_FEEDBACK

You are generating feedback for a financial-life simulation game. A user in
Month ${month} faced this scenario: "${scenario?.title}" — ${scenario?.narrative}

They chose: "${choice?.text}"

Their financial state BEFORE this decision:
${JSON.stringify(previousState, null, 2)}

Their financial state AFTER this decision:
${JSON.stringify(newState, null, 2)}

Immediate impact: ${JSON.stringify(immediateImpact)}
Projected 12-month impact: ${JSON.stringify(projected12MonthImpact)}

${patternSummary ? `Behavioral context: ${patternSummary}` : ""}

Tone guidance: ${toneInstruction}
${spectrumSection}

IMPORTANT: All currency values are in Indian Rupees. Always use the ₹ symbol
(never $ or "USD" or "dollars") when referencing any amount, and always
include the ₹ symbol — never write a bare number without it.

Respond with ONLY a valid JSON object (no markdown, no preamble) in exactly
this shape:
{
  "explanation": "2-3 sentences on why this outcome happened and what it means. Never invent numbers — only reference the numbers given above.",
  "lesson": "1 short, general takeaway sentence.",
  "alternativeComparison": "1-2 sentences comparing this outcome to the alternative(s) described above.",
  "forwardTip": "1 short sentence gently priming the user for the NEXT decision, without revealing the 'correct' choice."
}`;
}

module.exports = { buildDecisionFeedbackPrompt };
