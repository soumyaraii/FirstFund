/**
 * responseParser.js
 * ---------------------------------------------------------
 * Every LLM call is expected to return JSON, but models
 * (especially open ones) sometimes wrap it in markdown fences
 * or add stray text. This safely extracts and parses it, and
 * always returns a usable object — never throws to the caller.
 * ---------------------------------------------------------
 */

/**
 * @param {string} rawText - raw text returned by the model
 * @param {Object} fallback - object to return if parsing fails
 * @returns {Object}
 */
function safeParseJSON(rawText, fallback) {
  if (!rawText || typeof rawText !== "string") {
    return fallback;
  }

  try {
    // Strip ```json ... ``` or ``` ... ``` fences if present
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error("responseParser: failed to parse LLM response, using fallback.", err.message);
    return fallback;
  }
}

// Fallback objects used across the app if the AI call fails entirely.
const FALLBACKS = {
  decisionFeedback: {
    explanation: "This decision affected your financial position this month.",
    lesson: "Every choice compounds over the year — small shifts add up.",
    alternativeComparison: "A different choice here would have led to a different outcome by year-end.",
    forwardTip: ""
  },
  finalSummary: {
    biggestWin: "You made at least one strong protective decision this year.",
    biggestMistake: "There was at least one decision worth reconsidering.",
    finalAnalysis: "You navigated your first year of earning with a mix of strengths and areas to improve."
  }
};

module.exports = { safeParseJSON, FALLBACKS };
