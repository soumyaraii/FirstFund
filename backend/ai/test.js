/**
 * test.js — quick manual test using Person 1's actual sample data
 * Run with: node test.js
 */

const { generateDecisionFeedback, generateFinalSummary } = require("./index");

async function testDecisionFeedback() {
  console.log("\n=== TEST 1: Standard decision (Month 4, EMI trap) ===\n");

  const payload = {
    month: 4,
    scenario: {
      title: "Credit Card Trap",
      narrative: "You receive an offer for a brand new smartphone: 'Buy now and pay only ₹3,000/month with No-Cost EMI!' Total cost is ₹36,000."
    },
    choice: { id: "OPT_A", text: "Buy using 12-month EMI (₹3,000/month)" },
    previousState: { month: 4, savings: 82000, emergencyFund: 20000, investments: 40000, debt: 0, netWorth: 142000 },
    newState: { month: 5, savings: 82000, emergencyFund: 20000, investments: 40000, debt: 36000, netWorth: 106000 },
    immediateImpact: { savingsDelta: 0, investmentsDelta: 0, debtDelta: 36000, netWorthDelta: -36000 },
    projected12MonthImpact: { netWorthDelta: -41200 },
    choiceHistorySoFar: [
      { month: 1, choiceId: "OPT_B", tag: "SAVING_DISCIPLINE" },
      { month: 2, choiceId: "OPT_A", tag: "FRUGAL_HOUSING" },
      { month: 3, choiceId: "OPT_C", tag: "SKIPPED_INSURANCE" }
    ],
    mentorPersona: "supportive"
  };

  const result = await generateDecisionFeedback(payload);
  console.log(JSON.stringify(result, null, 2));
}

async function testPivotalMonth() {
  console.log("\n=== TEST 2: Pivotal month with alternativePaths (Month 7, Emergency) ===\n");

  const payload = {
    month: 7,
    scenario: { title: "Unexpected Emergency", narrative: "A sudden medical expense of ₹25,000 comes up." },
    choice: { id: "OPT_A", text: "Use emergency fund" },
    previousState: { savings: 60000, emergencyFund: 40000, investments: 50000, debt: 0, netWorth: 150000 },
    newState: { savings: 60000, emergencyFund: 15000, investments: 50000, debt: 0, netWorth: 125000 },
    immediateImpact: { savingsDelta: 0, investmentsDelta: 0, debtDelta: 0, netWorthDelta: -25000 },
    projected12MonthImpact: { netWorthDelta: -25000 },
    choiceHistorySoFar: [
      { month: 1, choiceId: "OPT_B", tag: "SAVING_DISCIPLINE" },
      { month: 2, choiceId: "OPT_B", tag: "FRUGAL_HOUSING" },
      { month: 3, choiceId: "OPT_A", tag: "EMERGENCY_FUND" }
    ],
    alternativePaths: [
      { label: "Safest Path", netWorth: 140000 },
      { label: "Riskiest Path (used debt instead)", netWorth: 95000 }
    ],
    mentorPersona: "strict"
  };

  const result = await generateDecisionFeedback(payload);
  console.log(JSON.stringify(result, null, 2));
}

async function testFinalSummary() {
  console.log("\n=== TEST 3: Final summary (Month 12 scorecard) ===\n");

  const payload = {
    totalScore: 78,
    metrics: { emergencyReadiness: 82, savingDiscipline: 91, riskManagement: 64, spendingDiscipline: 72, investmentBehaviour: 78 },
    financials: { startingNetWorth: 0, finalNetWorth: 284500, totalSavings: 120000, totalInvestments: 145000, emergencyFund: 25000, remainingDebt: 5500 },
    trajectory: [
      { month: 1, netWorth: 35000 },
      { month: 4, netWorth: 106000 },
      { month: 12, netWorth: 284500 }
    ],
    personality: "Balanced Planner",
    fullChoiceHistory: [
      { month: 1, tag: "SAVING_DISCIPLINE" },
      { month: 4, tag: "TOOK_DEBT" },
      { month: 7, tag: "EMERGENCY_FUND" }
    ],
    mentorPersona: "analyst"
  };

  const result = await generateFinalSummary(payload);
  console.log(JSON.stringify(result, null, 2));
}

(async () => {
  await testDecisionFeedback();
  await testPivotalMonth();
  await testFinalSummary();
})();
