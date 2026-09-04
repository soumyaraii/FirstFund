/**
 * toneMatcher.js
 * ---------------------------------------------------------
 * Feature 6 — Severity-Based Tone Matching.
 *
 * A ₹500 swing and a ₹50,000 swing shouldn't read the same.
 * This is pure logic — no AI call — it just decides which
 * instruction line to inject into the prompt.
 * ---------------------------------------------------------
 */

const LOW_THRESHOLD = 5000;    // below this: minor, keep it light
const HIGH_THRESHOLD = 30000;  // above this: major, allow more weight

/**
 * @param {number} netWorthDelta - can be positive or negative
 * @returns {string} instruction line to inject into the prompt
 */
function getToneInstruction(netWorthDelta) {
  const magnitude = Math.abs(netWorthDelta);

  if (magnitude < LOW_THRESHOLD) {
    return "This was a minor financial event. Keep the tone light and matter-of-fact — do not overstate its importance.";
  }

  if (magnitude > HIGH_THRESHOLD) {
    return "This was a major financial event with significant long-term impact. It's appropriate to be a little more emphatic that this decision mattered more than most.";
  }

  return "This was a moderate financial event. Explain it plainly without over- or under-stating its importance.";
}

module.exports = { getToneInstruction };
