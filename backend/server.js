import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';

// ---------------------------------------------------------
// Bridge to import Person 2's CommonJS AI module from this
// ESM file. This works without needing to convert the AI
// module to ESM. Adjust the path below if the `ai` folder
// is placed somewhere other than directly next to server.js
// (e.g. change to './backend/ai/index.js' if nested).
// ---------------------------------------------------------
const require = createRequire(import.meta.url);
const { generateDecisionFeedback, generateFinalSummary } = require('./ai/index.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins, methods, and preflight headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Explicitly handle preflight requests across all endpoints
app.options('*', cors());

app.use(express.json());

// Health Check route to verify backend is active from a browser or phone
app.get('/', (req, res) => {
  res.json({ status: "healthy", message: "FirstFund Backend is live!" });
});

// In-Memory Storage
const sessions = new Map();


// Configuration Constants
const SALARY_MAP = {
  "3-5_LPA": 28000,
  "5-8_LPA": 45000,
  "8-12_LPA": 65000,
  "12-18_LPA": 95000,
  "18_PLUS_LPA": 135000
};

const BASE_EXPENSE_MAP = {
  home: { metro: 6000, tier_2: 4500, tier_3: 3000 },
  pg: { metro: 15000, tier_2: 10000, tier_3: 7000 },
  renting: { metro: 24000, tier_2: 15000, tier_3: 10000 }
};

// 12-Month Scenario Journey
// Every month now has a decision so the simulation progresses continuously:
// Month 1 -> Month 2 -> ... -> Month 12
const scenarios = [
  {
    id: 1, month: 1, category: "CASH_FLOW", title: "First Salary Celebration",
    narrative: "Your first paycheck has arrived! After rent and basic living expenses, you have remaining surplus. What is your first move?",
    options: [
      { id: "OPT_A", text: "Spend ₹20,000 on gadgets & celebrations", tag: "discretionary_splurge", effects: { savingsDelta: -20000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 20000 } },
      { id: "OPT_B", text: "Put ₹15,000 in Emergency Reserve and ₹5,000 in Savings", tag: "saving_discipline", effects: { savingsDelta: 5000, emergencyDelta: 15000, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 2, month: 2, category: "HOUSING", title: "Housing & Lifestyle Choice",
    narrative: "Your initial temporary stay is ending. Choose your living arrangement.",
    options: [
      { id: "OPT_A", text: "Rent a premium 1BHK alone (+₹8,000/mo fixed cost)", tag: "lifestyle_inflation", effects: { fixedExpenseDelta: 8000, savingsDelta: 0, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Share a 2BHK flat with a roommate (No extra cost)", tag: "frugal_housing", effects: { fixedExpenseDelta: 0, savingsDelta: 10000, emergencyDelta: 5000, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 3, month: 3, category: "SAVING", title: "Build Your First Investment Habit",
    narrative: "You have started earning consistently. You can now turn part of this month's surplus into a long-term habit.",
    options: [
      { id: "OPT_A", text: "Invest ₹10,000 in a diversified index fund", tag: "disciplined_investing", effects: { savingsDelta: -10000, emergencyDelta: 0, investmentDelta: 10000, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Keep the ₹10,000 in your savings account", tag: "cash_first", effects: { savingsDelta: 10000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 4, month: 4, category: "CREDIT_AND_DEBT", title: "Credit Card & EMI Trap",
    narrative: "A major sale offers the newest phone for ₹36,000 on a 12-month No-Cost EMI scheme.",
    options: [
      { id: "OPT_A", text: "Buy phone on 12-month EMI (Adds ₹36,000 debt)", tag: "debt_trap", effects: { savingsDelta: 0, emergencyDelta: 0, investmentDelta: 0, debtDelta: 36000, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Skip the upgrade and keep existing phone", tag: "delayed_gratification", effects: { savingsDelta: 15000, emergencyDelta: 5000, investmentDelta: 5000, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 5, month: 5, category: "PROTECTION", title: "Insurance Before the Unexpected",
    narrative: "You can now add basic financial protection before your responsibilities grow.",
    options: [
      { id: "OPT_A", text: "Pay ₹3,000 for basic health insurance coverage", tag: "risk_protection", effects: { savingsDelta: -3000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 3000 } },
      { id: "OPT_B", text: "Skip insurance and keep the cash", tag: "underinsured", effects: { savingsDelta: 5000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 6, month: 6, category: "RISK_AND_FOMO", title: "Crypto / Hot Stock Tip",
    narrative: "A friend shares a high-risk speculative tip claiming guaranteed fast returns.",
    isPivotal: true,
    options: [
      { id: "OPT_A", text: "Put ₹25,000 into the speculative asset", tag: "fomo_speculation", effects: { savingsDelta: -25000, emergencyDelta: 0, investmentDelta: 5000, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Stick to index mutual funds (₹10,000)", tag: "disciplined_investing", effects: { savingsDelta: -10000, emergencyDelta: 0, investmentDelta: 10000, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 7, month: 7, category: "EMERGENCY", title: "Sudden Medical Emergency",
    narrative: "An unexpected medical bill demands ₹25,000 immediately.",
    isEmergency: true,
    options: [
      { id: "OPT_A", text: "Pay using available Emergency Fund / Liquid Savings", tag: "emergency_buffer_used", effects: { savingsDelta: 0, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 8, month: 8, category: "LIFESTYLE", title: "The Lifestyle Creep Test",
    narrative: "Your friends plan an expensive weekend trip. You can afford it, but it would slow your financial progress.",
    options: [
      { id: "OPT_A", text: "Spend ₹12,000 on the trip", tag: "lifestyle_spending", effects: { savingsDelta: -12000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 12000 } },
      { id: "OPT_B", text: "Choose a ₹3,000 local plan and save the rest", tag: "spending_discipline", effects: { savingsDelta: 9000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 3000 } }
    ]
  },
  {
    id: 9, month: 9, category: "GOALS", title: "Plan for a Near-Term Goal",
    narrative: "You want to buy a laptop next year. Decide how to prepare without taking on unnecessary debt.",
    options: [
      { id: "OPT_A", text: "Create a ₹15,000 goal fund from this month's surplus", tag: "goal_based_saving", effects: { savingsDelta: 15000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Use a credit card when the time comes", tag: "future_debt", effects: { savingsDelta: 5000, emergencyDelta: 0, investmentDelta: 0, debtDelta: 15000, discretionarySpent: 0 } }
    ]
  },
  {
    id: 10, month: 10, category: "INCOME", title: "Unexpected Bonus",
    narrative: "You receive a ₹20,000 performance bonus. This is a chance to strengthen your financial position.",
    options: [
      { id: "OPT_A", text: "Invest ₹15,000 and keep ₹5,000 as cash", tag: "balanced_bonus", effects: { savingsDelta: 5000, emergencyDelta: 0, investmentDelta: 15000, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Spend the bonus on a new experience", tag: "bonus_splurge", effects: { savingsDelta: 0, emergencyDelta: 0, investmentDelta: 0, debtDelta: 0, discretionarySpent: 20000 } }
    ]
  },
  {
    id: 11, month: 11, category: "EMERGENCY", title: "Strengthen Your Safety Net",
    narrative: "The year is almost over. Before chasing higher returns, decide whether your emergency buffer is strong enough.",
    options: [
      { id: "OPT_A", text: "Move ₹10,000 into your Emergency Reserve", tag: "emergency_readiness", effects: { savingsDelta: -10000, emergencyDelta: 10000, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Invest ₹10,000 for higher long-term growth", tag: "growth_focus", effects: { savingsDelta: -10000, emergencyDelta: 0, investmentDelta: 10000, debtDelta: 0, discretionarySpent: 0 } }
    ]
  },
  {
    id: 12, month: 12, category: "YEAR_END", title: "Year-End Review",
    narrative: "You completed your first working year! How do you deploy your final surplus?",
    options: [
      { id: "OPT_A", text: "Diversify into long-term index funds and clear remaining debt", tag: "balanced_growth", effects: { savingsDelta: 5000, emergencyDelta: 5000, investmentDelta: 20000, debtDelta: -36000, discretionarySpent: 0 } },
      { id: "OPT_B", text: "Keep the final surplus liquid for flexibility", tag: "liquidity_first", effects: { savingsDelta: 20000, emergencyDelta: 5000, investmentDelta: 0, debtDelta: 0, discretionarySpent: 0 } }
    ]
  }
];

const calculateNetWorth = (s, e, i, d) => (s + e + i) - d;

// ---------------------------------------------------------
// Shared effect-application logic, factored out so it can be
// reused both for the real chosen decision AND for simulating
// hypothetical alternative paths (needed for alternativePaths
// on pivotal/emergency months).
// ---------------------------------------------------------
function applyEffects(financials, effects, isEmergencyScenario) {
  let { monthlyIncome, fixedExpenses, savings, emergencyFund, investments, debt } = financials;

  if (effects.fixedExpenseDelta) fixedExpenses += effects.fixedExpenseDelta;

  const surplus = monthlyIncome - fixedExpenses;
  savings += Math.max(0, surplus + (effects.savingsDelta || 0));
  emergencyFund += (effects.emergencyDelta || 0);
  investments += (effects.investmentDelta || 0);
  debt = Math.max(0, debt + (effects.debtDelta || 0));

  if (isEmergencyScenario) {
    const required = 25000;
    if (emergencyFund >= required) {
      emergencyFund -= required;
    } else {
      const rem = required - emergencyFund;
      emergencyFund = 0;
      if (savings >= rem) {
        savings -= rem;
      } else {
        debt += Math.round((rem - savings) * 1.15);
        savings = 0;
      }
    }
  }

  const netWorth = calculateNetWorth(savings, emergencyFund, investments, debt);
  return { monthlyIncome, fixedExpenses, savings, emergencyFund, investments, debt, netWorth };
}

// ---------------------------------------------------------
// Computes the "alternativePaths" spectrum (feature 7) for
// pivotal months only. Returns null for ordinary months.
//
// Month 6 (isPivotal): both real options exist in the scenario,
// so we simulate each one and label by risk level using the tag.
//
// Month 7 (isEmergency): only one real option exists, so we
// simulate two synthetic scenarios — "no emergency fund" vs
// "well-funded emergency reserve" — to show the spectrum.
// ---------------------------------------------------------
function computeAlternativePaths(scenario, prevFinancials) {
  if (scenario.isPivotal) {
    const paths = scenario.options.map(opt => {
      const result = applyEffects(prevFinancials, opt.effects, false);
      const isRisky = /risk|fomo|speculat|debt/i.test(opt.tag);
      return { label: isRisky ? "Riskiest Path" : "Safest Path", netWorth: result.netWorth };
    });
    return paths;
  }

  if (scenario.isEmergency) {
    const noFundState = { ...prevFinancials, emergencyFund: 0 };
    const wellFundedState = { ...prevFinancials, emergencyFund: 50000 };

    const worst = applyEffects(noFundState, {}, true);
    const best = applyEffects(wellFundedState, {}, true);

    return [
      { label: "Safest Path (Well-Funded Reserve)", netWorth: best.netWorth },
      { label: "Riskiest Path (No Emergency Fund)", netWorth: worst.netWorth }
    ];
  }

  return null;
}

// 1. POST /api/simulation/start
app.post('/api/simulation/start', (req, res) => {
  const { salaryRange = "8-12_LPA", cityTier = "metro", housing = "pg", mentorPersona = "strict" } = req.body;
  const sessionId = `sim_${uuidv4().slice(0, 8)}`;

  const monthlyIncome = SALARY_MAP[salaryRange] || 65000;
  const fixedExpenses = BASE_EXPENSE_MAP[housing]?.[cityTier] || 15000;

  const session = {
    sessionId,
    mentorPersona,
    month: 1,
    financials: {
      monthlyIncome,
      fixedExpenses,
      discretionaryExpenses: 0,
      savings: 0,
      emergencyFund: 0,
      investments: 0,
      debt: 0,
      netWorth: 0
    },
    history: []
  };

  sessions.set(sessionId, session);

  res.status(201).json({
    sessionId,
    mentorPersona,
    currentState: session.financials,
    currentScenario: scenarios[0]
  });
});

// 2. GET /api/simulation/:sessionId (Session Restore Endpoint)
app.get('/api/simulation/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const currentScenario = session.month <= 12 ? scenarios.find(s => s.month === session.month) || null : null;

  res.json({
    sessionId: session.sessionId,
    mentorPersona: session.mentorPersona,
    month: session.month,
    currentState: session.financials,
    currentScenario,
    history: session.history,
    isComplete: session.month > 12
  });
});

// 3. POST /api/simulation/decision
// NOTE: now async — it awaits Person 2's AI module instead of
// returning hardcoded aiFeedback text.
app.post('/api/simulation/decision', async (req, res) => {
  try {
    const { sessionId, month, choiceId } = req.body;
    const session = sessions.get(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });

    const scenario = scenarios.find(s => s.month === month) || scenarios[0];
    const option = scenario.options.find(o => o.id === choiceId) || scenario.options[0];
    const prev = { ...session.financials };

    const updatedFinancials = applyEffects(prev, option.effects, !!scenario.isEmergency);
    updatedFinancials.discretionaryExpenses = option.effects.discretionarySpent || 0;

    const prevNetWorth = calculateNetWorth(prev.savings, prev.emergencyFund, prev.investments, prev.debt);

    const immediateImpact = {
      savingsDelta: updatedFinancials.savings - prev.savings,
      investmentsDelta: updatedFinancials.investments - prev.investments,
      debtDelta: updatedFinancials.debt - prev.debt,
      netWorthDelta: updatedFinancials.netWorth - prevNetWorth
    };

    const projected12MonthImpact = {
      netWorthDelta: (updatedFinancials.netWorth - prevNetWorth) * (13 - month)
    };

    // choiceHistorySoFar reflects everything BEFORE this decision
    const choiceHistorySoFar = session.history.map(h => ({
      month: h.month,
      choiceId: h.choiceId,
      tag: h.tag
    }));

    // Only computed for pivotal/emergency months (6 & 7); null otherwise
    const alternativePaths = computeAlternativePaths(scenario, prev);

    // ---- Call Person 2's AI module (real call, replaces old hardcoded text) ----
    const aiFeedback = await generateDecisionFeedback({
      month,
      scenario: { title: scenario.title, narrative: scenario.narrative },
      choice: { id: option.id, text: option.text },
      previousState: prev,
      newState: updatedFinancials,
      immediateImpact,
      projected12MonthImpact,
      choiceHistorySoFar,
      alternativePaths: alternativePaths || undefined,
      mentorPersona: session.mentorPersona
    });

    if (alternativePaths) {
      aiFeedback.alternativePaths = alternativePaths;
    }

    // Find the NEXT available milestone scenario
    const nextScenario = scenarios.find(s => s.month > month) || null;

    // Update session state
    session.month = nextScenario ? nextScenario.month : 13;
    session.financials = updatedFinancials;
    session.history.push({ month, choiceId: option.id, tag: option.tag, netWorth: updatedFinancials.netWorth });
    sessions.set(sessionId, session);

    // ---- Response shape now matches the locked contract (flat fields) ----
    res.json({
      sessionId,
      month,
      previousState: prev,
      newState: updatedFinancials,
      immediateImpact,
      projected12MonthImpact,
      aiFeedback,
      nextScenario
    });
  } catch (err) {
    console.error("Error in /api/simulation/decision:", err);
    res.status(500).json({ error: "Something went wrong processing this decision." });
  }
});

// 4. GET /api/simulation/:sessionId/scorecard
// NOTE: now async — it awaits Person 2's AI module for aiSummary.
app.get('/api/simulation/:sessionId/scorecard', async (req, res) => {
  try {
    const session = sessions.get(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const f = session.financials;

    // Field names now match the locked contract (metrics.*)
    const metrics = {
      savingDiscipline: 88,
      riskManagement: 70,
      spendingDiscipline: 75,
      investmentBehaviour: 80,
      emergencyReadiness: f.emergencyFund >= 20000 ? 90 : 45
    };

    const totalScore = Math.round(
      (metrics.savingDiscipline + metrics.riskManagement + metrics.spendingDiscipline +
        metrics.investmentBehaviour + metrics.emergencyReadiness) / 5
    );

    const personality = "Balanced Planner"; // Person 1's deterministic rule-based label

    const fullChoiceHistory = session.history.map(h => ({ month: h.month, tag: h.tag }));

    // ---- Call Person 2's AI module (real call, replaces old hardcoded text) ----
    const aiSummary = await generateFinalSummary({
      totalScore,
      metrics,
      financials: {
        startingNetWorth: 0,
        finalNetWorth: f.netWorth,
        totalSavings: f.savings,
        totalInvestments: f.investments,
        emergencyFund: f.emergencyFund,
        remainingDebt: f.debt
      },
      trajectory: session.history,
      personality,
      fullChoiceHistory,
      mentorPersona: session.mentorPersona
    });

    res.json({
      sessionId: session.sessionId,
      totalScore,
      metrics,
      financials: {
        startingNetWorth: 0,
        finalNetWorth: f.netWorth,
        totalSavings: f.savings,
        totalInvestments: f.investments,
        emergencyFund: f.emergencyFund,
        remainingDebt: f.debt
      },
      trajectory: session.history,
      personality,
      aiSummary
    });
  } catch (err) {
    console.error("Error in /api/simulation/:sessionId/scorecard:", err);
    res.status(500).json({ error: "Something went wrong generating the scorecard." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});