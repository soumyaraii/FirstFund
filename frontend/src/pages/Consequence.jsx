import "./Consequence.css";

function Consequence({ consequenceData, onContinue, loading }) {
  const {
    month,
    choiceText,
    immediateImpact = {},
    projectedImpact = 0,
    explanation,
    lesson,
    alternativeComparison,
    forwardTip,
    comparison,
    alternativePaths,
    nextScenario,
  } = consequenceData;

  const formatMoney = (amount = 0) => {
    const sign = amount > 0 ? "+" : amount < 0 ? "−" : "";
    return `${sign}₹${Math.abs(Number(amount)).toLocaleString("en-IN")}`;
  };

  const impactClass = (value = 0) => {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
  };

  return (
    <div className="consequence-page">
      <header className="consequence-header">
        <div className="consequence-logo">
          First<span>Fund</span>
        </div>

        <div className="consequence-month">
          MONTH {String(month).padStart(2, "0")} <span>· CONSEQUENCE</span>
        </div>
      </header>

      <main className="consequence-container">
        <section className="consequence-intro">
          <div className="consequence-eyebrow">YOUR DECISION</div>
          <h1>
            Your choice has<br />
            consequences.
          </h1>
          <p>{choiceText}</p>
        </section>

        <section className="impact-section">
          <div className="section-label">IMMEDIATE IMPACT</div>

          <div className="impact-grid">
            <div className="impact-card">
              <span>NET WORTH</span>
              <strong className={impactClass(immediateImpact.netWorthDelta)}>
                {formatMoney(immediateImpact.netWorthDelta)}
              </strong>
            </div>

            <div className="impact-card">
              <span>SAVINGS</span>
              <strong className={impactClass(immediateImpact.savingsDelta)}>
                {formatMoney(immediateImpact.savingsDelta)}
              </strong>
            </div>

            <div className="impact-card">
              <span>INVESTMENTS</span>
              <strong className={impactClass(immediateImpact.investmentsDelta)}>
                {formatMoney(immediateImpact.investmentsDelta)}
              </strong>
            </div>

            <div className="impact-card">
              <span>DEBT</span>
              <strong className={impactClass(-Number(immediateImpact.debtDelta || 0))}>
                {formatMoney(immediateImpact.debtDelta)}
              </strong>
            </div>
          </div>

          <div className="projection-card">
            <div>
              <span>PROJECTED 12-MONTH IMPACT</span>
              <p>How this decision could affect your position by year end.</p>
            </div>
            <strong className={impactClass(projectedImpact)}>
              {formatMoney(projectedImpact)}
            </strong>
          </div>
        </section>

        {(comparison || alternativeComparison) && (
          <section className="feedback-section">
            <div className="feedback-card">
              <div className="feedback-label">ALTERNATIVE COMPARISON</div>
              <h2>What another path could have looked like</h2>
              <p className="feedback-explanation">
                {comparison?.comparisonNarrative || alternativeComparison}
              </p>

              {comparison?.alternativeLabel && (
                <div className="comparison-highlight">
                  <span>{comparison.alternativeLabel}</span>
                  <strong>
                    ₹{Number(comparison.alternativeNetWorth || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

              {alternativePaths?.length > 0 && (
                <div className="path-comparison">
                  {alternativePaths.map((path) => (
                    <div className="path-row" key={path.label}>
                      <span>{path.label}</span>
                      <strong>
                        ₹{Number(path.netWorth || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="feedback-section">
          <div className="feedback-card">
            <div className="feedback-label">AI MENTOR</div>
            <h2>What this means</h2>

            <p className="feedback-explanation">
              {explanation || "Your financial outcome has been calculated. Your AI mentor is preparing the explanation."}
            </p>

            <div className="feedback-divider" />

            {lesson && (
              <div className="feedback-block">
                <span>THE LESSON</span>
                <p>{lesson}</p>
              </div>
            )}

            {forwardTip && (
              <div className="feedback-block">
                <span>LOOKING AHEAD</span>
                <p>{forwardTip}</p>
              </div>
            )}
          </div>
        </section>

        <div className="consequence-action">
          <button onClick={onContinue} disabled={loading}>
            {loading
              ? "Loading..."
              : nextScenario
                ? `Continue to Month ${nextScenario.month}`
                : "View My Year-End Scorecard"}
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Consequence;
