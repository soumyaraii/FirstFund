/**
 * index.js
 * ---------------------------------------------------------
 * Person 1 should only ever import from this file:
 *
 *   const { generateDecisionFeedback, generateFinalSummary } = require("./ai");
 *
 * Everything else in this folder is an internal implementation
 * detail and can change without breaking the integration.
 * ---------------------------------------------------------
 */

const { generateDecisionFeedback } = require("./decisionFeedback");
const { generateFinalSummary } = require("./finalSummary");

module.exports = {
  generateDecisionFeedback,
  generateFinalSummary
};
