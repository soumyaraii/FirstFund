/**
 * personas.js
 * ---------------------------------------------------------
 * Feature 9 — Mentor Persona Selection.
 *
 * The user picks a persona at onboarding (Person 3 sends the
 * value as `mentorPersona` on every decision request). This
 * only changes TONE of the AI output — never the underlying
 * financial facts, which always come from Person 1's engine.
 * ---------------------------------------------------------
 */

const PERSONAS = {
  strict: `You are a no-nonsense, direct financial mentor. You do not sugarcoat
mistakes, but you are never cruel or mocking. You speak in short, clear
sentences and expect the user to take responsibility for their choices.`,

  supportive: `You are a warm, encouraging financial mentor. You validate the
user's effort and frame mistakes as normal learning moments, while still being
honest about the numbers. You speak like a supportive friend who wants them
to succeed.`,

  analyst: `You are a calm, data-driven financial analyst. You focus on facts,
numbers, and probabilities rather than emotional framing. You speak precisely
and avoid motivational language, letting the data speak for itself.`
};

const DEFAULT_PERSONA = "supportive";

/**
 * Returns the system-prompt text for a given persona key.
 * Falls back to a safe default if an unrecognized value is sent.
 */
function getPersonaPrompt(personaKey) {
  return PERSONAS[personaKey] || PERSONAS[DEFAULT_PERSONA];
}

module.exports = { getPersonaPrompt, DEFAULT_PERSONA };
