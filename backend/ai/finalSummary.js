/**
 * finalSummary.js
 * ---------------------------------------------------------
 * PUBLIC ENTRY POINT — Person 1 calls this once, at the end of
 * month 12, and injects the returned object directly into
 * `aiSummary` in the final scorecard response sent to Person 3.
 * ---------------------------------------------------------
 */

const { callAI } = require("./aiService");
const { buildFinalSummaryPrompt } = require("./prompts/finalSummaryPrompt");
const { getPersonaPrompt } = require("./personas");
const { safeParseJSON, FALLBACKS } = require("./utils/responseParser");

/**
 * @param {Object} payload - see finalSummaryPrompt.js for full shape.
 *   Must also include `mentorPersona` forwarded from onboarding.
 * @returns {Promise<Object>} { biggestWin, biggestMistake, finalAnalysis }
 */
async function generateFinalSummary(payload) {
  const systemPrompt = getPersonaPrompt(payload.mentorPersona);
  const userPrompt = buildFinalSummaryPrompt(payload);

  let rawResponse;
  try {
    rawResponse = await callAI({ systemPrompt, userPrompt, temperature: 0.5 });
    // Slightly higher temperature here — this is the one place a bit more
    // "voice" in the writing is desirable, per our earlier plan.
  } catch (err) {
    console.error("generateFinalSummary: AI call failed, using fallback.", err.message);
    return FALLBACKS.finalSummary;
  }

  return safeParseJSON(rawResponse, FALLBACKS.finalSummary);
}

module.exports = { generateFinalSummary };
