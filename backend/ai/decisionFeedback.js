/**
 * decisionFeedback.js
 * ---------------------------------------------------------
 * PUBLIC ENTRY POINT — Person 1 calls this after every decision
 * (months 1-12) and injects the returned object directly into
 * `aiFeedback` in the decision response sent to Person 3.
 * ---------------------------------------------------------
 */

const { callAI } = require("./aiService");
const { buildDecisionFeedbackPrompt } = require("./prompts/decisionFeedbackPrompt");
const { getPersonaPrompt } = require("./personas");
const { safeParseJSON, FALLBACKS } = require("./utils/responseParser");

/**
 * @param {Object} payload - see decisionFeedbackPrompt.js for full shape.
 *   Must also include `mentorPersona` ("strict" | "supportive" | "analyst")
 *   forwarded from Person 3's onboarding selection.
 * @returns {Promise<Object>} { explanation, lesson, alternativeComparison, forwardTip }
 */
async function generateDecisionFeedback(payload) {
  const systemPrompt = getPersonaPrompt(payload.mentorPersona);
  const userPrompt = buildDecisionFeedbackPrompt(payload);

  let rawResponse;
  try {
    rawResponse = await callAI({ systemPrompt, userPrompt, temperature: 0.3 });
  } catch (err) {
    console.error("generateDecisionFeedback: AI call failed, using fallback.", err.message);
    return FALLBACKS.decisionFeedback;
  }

  return safeParseJSON(rawResponse, FALLBACKS.decisionFeedback);
}

module.exports = { generateDecisionFeedback };
