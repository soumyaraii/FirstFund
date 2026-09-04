import "./Simulation.css";
import NetWorthChart from "../components/NetWorthChart";

function Simulation({ simulationData, onDecision, loading }) {
  const { currentState, currentScenario, mentorPersona } =
    simulationData;

  const formatMoney = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const currentMonth = currentScenario?.month || currentState?.month || 1;
  const monthProgress = (currentMonth / 12) * 100;

  // ---- UPDATED: backend now has a real decision every month (1-12) ----
  // so the decision counter is simply the current month out of 12,
  // no more hardcoded milestone list.
  const decisionNumber = currentMonth;
  const decisionCount = 12;

  return (
    <div className="simulation-page">

      {/* HEADER */}
      <header className="simulation-header">

        <div className="simulation-logo">
          First<span>Fund</span>
        </div>

        <div className="month-progress">
          <span>
            MONTH {String(currentMonth).padStart(2, "0")}
          </span>

          <div className="month-progress-track">
            <div
              className="month-progress-fill"
              style={{ width: `${monthProgress}%` }}
            />
          </div>

          <span className="month-total">12</span>
        </div>

        <div className="mentor-label">
          <span className="mentor-dot"></span>

          {mentorPersona === "strict"
            ? "Strict Mentor"
            : mentorPersona === "supportive"
            ? "Supportive Friend"
            : "Data-Driven Analyst"}
        </div>

      </header>

      <main className="simulation-container">

        {/* TOP SECTION */}
        <section className="simulation-top">

          <div>
            <div className="simulation-eyebrow">
              YOUR FINANCIAL JOURNEY
            </div>

            <h1>
              Month {currentMonth}
            </h1>

            <p>
              Your first month starts with your first salary.
            </p>
          </div>

          <div className="net-worth-box">
            <span>NET WORTH</span>

            <strong>
              {formatMoney(currentState.netWorth)}
            </strong>
          </div>

        </section>

        {/* FINANCIAL STATS */}
        <section className="financial-stats">

          <div className="stat-card">
            <span>MONTHLY INCOME</span>

            <strong>
              {formatMoney(currentState.monthlyIncome)}
            </strong>
          </div>

          <div className="stat-card">
            <span>FIXED EXPENSES</span>

            <strong>
              {formatMoney(currentState.fixedExpenses)}
            </strong>
          </div>

          <div className="stat-card">
            <span>SAVINGS</span>

            <strong>
              {formatMoney(currentState.savings)}
            </strong>
          </div>

          <div className="stat-card">
            <span>EMERGENCY FUND</span>

            <strong>
              {formatMoney(currentState.emergencyFund)}
            </strong>
          </div>

        </section>

        {/* MAIN CONTENT */}
        <section className="simulation-main">

          {/* SCENARIO */}
          <div className="scenario-section">

            <div className="scenario-header">
              <span>
                {currentScenario?.category || "FINANCIAL JOURNEY"}
              </span>

              <span>
                DECISION {String(decisionNumber).padStart(2, "0")} / {String(decisionCount).padStart(2, "0")}
              </span>
            </div>

            <h2>
              {currentScenario.title}
            </h2>

            <p className="scenario-narrative">
              {currentScenario.narrative}
            </p>

            <div className="decision-options">

              {currentScenario?.options?.map((option) => (
                <button
                  className="decision-card"
                  key={option.id}
                  onClick={() => onDecision(option.id)}
                  disabled={loading}
                >
                  <span className="option-id">
                    {option.id}
                  </span>

                  <span className="option-text">
                    {option.text}
                  </span>

                  <span className="option-arrow">
                    →
                  </span>
                </button>
              ))}

            </div>

          </div>

          {/* SIDEBAR */}
          <aside className="simulation-sidebar">

            <div className="sidebar-card">

              <div className="sidebar-title">
                YOUR PROGRESS
              </div>

              <div className="progress-number">

                <strong>
                  {currentMonth}
                </strong>

                <span>
                  / 12 months
                </span>

              </div>

              <div className="year-progress-track">

                <div
                  className="year-progress-fill"
                  style={{ width: `${monthProgress}%` }}
                />

              </div>

              <p>
                Every decision shapes your financial year.
              </p>

            </div>

            <div className="sidebar-card mentor-card">

              <div className="sidebar-title">
                MENTOR
              </div>

              <h3>
                {mentorPersona === "strict"
                  ? "Strict Mentor"
                  : mentorPersona === "supportive"
                  ? "Supportive Friend"
                  : "Data-Driven Analyst"}
              </h3>

              <p>
                Your decisions will be evaluated with a focus
                on financial discipline and long-term responsibility.
              </p>

            </div>

          </aside>

        </section>

        <section className="net-worth-section">
          <NetWorthChart trajectory={simulationData.trajectory} />
        </section>

      </main>

    </div>
  );
}

export default Simulation;
