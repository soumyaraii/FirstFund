import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./FinalScorecard.css";

function FinalScorecard({ scorecard, onRestart }) {
  const formatMoney = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // ---- UPDATED: backend now returns `metrics` (not `scores`) ----
  const {
    totalScore,
    metrics = {},
    financials = {},
    personality = "Balanced Planner",
    aiSummary = {},
    trajectory = [],
  } = scorecard || {};

  const safeTrajectory = (trajectory || []).map((point) => ({
    month: point.month,
    netWorth: point.netWorth ?? 0,
  }));

  const maxNetWorth = Math.max(
    ...safeTrajectory.map((point) => point.netWorth),
    0
  );

  // ---- UPDATED: field names now match the locked contract ----
  const metricsList = [
    {
      label: "Saving Discipline",
      value: metrics.savingDiscipline,
    },
    {
      label: "Risk Management",
      value: metrics.riskManagement,
    },
    {
      label: "Spending Discipline",
      value: metrics.spendingDiscipline,
    },
    {
      label: "Investment Behaviour",
      value: metrics.investmentBehaviour,
    },
    {
      label: "Emergency Readiness",
      value: metrics.emergencyReadiness,
    },
  ];

  return (
    <div className="scorecard-page">

      <header className="scorecard-header">
        <div className="scorecard-logo">
          First<span>Fund</span>
        </div>

        <div className="scorecard-header-label">
          YEAR-END REVIEW
        </div>
      </header>

      <main className="scorecard-container">

        {/* INTRO */}
        <section className="scorecard-intro">

          <div className="scorecard-eyebrow">
            YOUR 12-MONTH JOURNEY
          </div>

          <h1>
            Your financial year,
            <br />
            <span>reviewed.</span>
          </h1>

          <p>
            You made decisions across all 12 months of the year. Here's how they shaped your
            financial position.
          </p>

        </section>

        {/* SCORE */}
        <section className="score-overview">

          <div className="score-circle">

            <div className="score-number">
              {totalScore}
            </div>

            <div className="score-out-of">
              / 100
            </div>

          </div>

          <div className="score-summary">

            <span className="section-label">
              OVERALL FINANCIAL SCORE
            </span>

            <h2>
              {personality}
            </h2>

            <p>
              Your financial personality based on the decisions
              you made throughout the year.
            </p>

          </div>

        </section>

        {/* FINANCIAL SNAPSHOT */}
        <section className="scorecard-section">

          <div className="section-label">
            FINANCIAL SNAPSHOT
          </div>

          <div className="financial-summary-grid">

            <div className="summary-card">
              <span>FINAL NET WORTH</span>
              <strong>
                {formatMoney(financials.finalNetWorth)}
              </strong>
            </div>

            <div className="summary-card">
              <span>TOTAL SAVINGS</span>
              <strong>
                {formatMoney(financials.totalSavings)}
              </strong>
            </div>

            <div className="summary-card">
              <span>INVESTMENTS</span>
              <strong>
                {formatMoney(financials.totalInvestments)}
              </strong>
            </div>

            <div className="summary-card">
              <span>EMERGENCY FUND</span>
              <strong>
                {formatMoney(financials.emergencyFund)}
              </strong>
            </div>

            <div className="summary-card">
              <span>REMAINING DEBT</span>
              <strong>
                {formatMoney(financials.remainingDebt)}
              </strong>
            </div>

          </div>

        </section>

        {/* METRICS */}
        <section className="scorecard-section">

          <div className="section-label">
            PERFORMANCE BREAKDOWN
          </div>

          <div className="metrics-card">

            {metricsList.map((metric) => (

              <div className="metric-row" key={metric.label}>

                <div className="metric-heading">

                  <span>
                    {metric.label}
                  </span>

                  <strong>
                    {metric.value}
                  </strong>

                </div>

                <div className="metric-track">

                  <div
                    className="metric-fill"
                    style={{
                      width: `${metric.value}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* TRAJECTORY */}
        <section className="scorecard-section">

          <div className="section-label">
            YOUR YEAR IN REVIEW
          </div>

          <div className="trajectory-card">

            <div className="trajectory-header">
              <div>
                <span>NET WORTH TRAJECTORY</span>
                <strong>
                  {formatMoney(
                    safeTrajectory.length
                      ? safeTrajectory[safeTrajectory.length - 1].netWorth
                      : financials.finalNetWorth
                  )}
                </strong>
              </div>

              <span className="trajectory-period">
                DECISIONS ACROSS THE YEAR
              </span>
            </div>

            <div className="trajectory-chart">
              {safeTrajectory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={safeTrajectory}
                    margin={{ top: 20, right: 12, left: 8, bottom: 10 }}
                  >
                    <CartesianGrid
                      stroke="rgba(155, 207, 75, 0.10)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(month) => `M${month}`}
                      tick={{ fill: "#c9c6b5", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(155, 207, 75, 0.18)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `₹${Math.round(Number(value) / 1000)}K`}
                      tick={{ fill: "#c9c6b5", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [formatMoney(Number(value)), "Net Worth"]}
                      labelFormatter={(month) => `Month ${month}`}
                      contentStyle={{
                        background: "#06261a",
                        border: "1px solid rgba(155, 207, 75, 0.18)",
                        borderRadius: "4px",
                        color: "#f2eddc",
                      }}
                      labelStyle={{ color: "#9bcf4b" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#9bcf4b"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#9bcf4b",
                        stroke: "#031b13",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="trajectory-empty">
                  Your net worth trajectory will appear here once the year is complete.
                </div>
              )}
            </div>

          </div>

        </section>

        {/* AI REVIEW */}
        <section className="scorecard-section">

          <div className="section-label">
            AI MENTOR REVIEW
          </div>

          <div className="ai-review-card">

            <div className="ai-review-header">

              <div className="ai-icon">
                ✦
              </div>

              <div>
                <span>YOUR YEAR IN PERSPECTIVE</span>
                <h2>
                  What you did well
                </h2>
              </div>

            </div>

            <div className="review-block">

              <span>BIGGEST WIN</span>

              <p>
                {aiSummary.biggestWin}
              </p>

            </div>

            <div className="review-block">

              <span>BIGGEST MISTAKE</span>

              <p>
                {aiSummary.biggestMistake}
              </p>

            </div>

            <div className="review-divider"></div>

            <div className="final-analysis">

              <span>FINAL ANALYSIS</span>

              <p>
                {aiSummary.finalAnalysis}
              </p>

            </div>

          </div>

        </section>

        {/* ACTION */}
        <section className="scorecard-action">

          <button onClick={onRestart}>
            Start Another Journey
            <span>→</span>
          </button>

        </section>

      </main>

    </div>
  );
}

export default FinalScorecard;
