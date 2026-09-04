require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
/**
 * aiService.js
 * ---------------------------------------------------------
 * Single point of contact with the LLM provider.
 * Every other file in /ai calls `callAI()` — nobody else
 * should know or care which provider/model is behind it.
 *
 * TODO: Wire up the real model call inside callAI() below.
 * (Currently returns a stub response so the rest of the
 * pipeline — prompts, parsing, wrappers — can be built and
 * tested before the model is connected.)
 * ---------------------------------------------------------
 */

const USE_STUB = false; // flip to false once a real model is wired in

/**
 * Calls the LLM with a system prompt + user prompt and expects
 * a JSON object back (as a string) which the caller will parse.
 *
 * @param {Object} params
 * @param {string} params.systemPrompt - persona / role instructions
 * @param {string} params.userPrompt   - the actual task + data
 * @param {number} [params.temperature] - creativity control (default 0.3)
 * @returns {Promise<string>} raw text response from the model (expected to be JSON)
 */
async function callAI({ systemPrompt, userPrompt, temperature = 0.3 }) {
  if (USE_STUB) {
    return stubResponse(userPrompt);
  }

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  });

  return response.choices[0].message.content;
}

/**
 * Temporary stub so the pipeline is testable before a model is wired in.
 * Detects which prompt type was sent (based on a marker string each
 * prompt builder includes) and returns a plausible fake JSON response.
 */
function stubResponse(userPrompt) {
  if (userPrompt.includes("TASK_TYPE: DECISION_FEEDBACK")) {
    return JSON.stringify({
      explanation: "[STUB] This decision affected your cash flow this month.",
      lesson: "[STUB] Small recurring commitments add up over a year.",
      alternativeComparison: "[STUB] A different choice here would have changed your year-end net worth.",
      forwardTip: "[STUB] Keep an eye on fixed monthly commitments as your income changes."
    });
  }

  if (userPrompt.includes("TASK_TYPE: FINAL_SUMMARY")) {
    return JSON.stringify({
      biggestWin: "[STUB] Your strongest decision of the year.",
      biggestMistake: "[STUB] Your weakest decision of the year.",
      finalAnalysis: "[STUB] Overall you showed a mix of caution and opportunity-taking across the year."
    });
  }

  return JSON.stringify({ error: "Unrecognized task type in stub." });
}

module.exports = { callAI };
