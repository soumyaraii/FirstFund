import { useState } from "react";
import "./Landing.css";

function Landing({ onStart }) {
  const [activeInfo, setActiveInfo] = useState(null);

  const closeInfo = () => setActiveInfo(null);

  return (
    <div className="landing-page">

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="logo">
          First<span>Fund</span>
        </div>

        <div className="nav-links">
          <button type="button" onClick={() => setActiveInfo("about")}>
            About
          </button>
          <button type="button" onClick={() => setActiveInfo("how") }>
            How it works
          </button>
        </div>
      </nav>


      {/* Main Hero Section */}
      <main className="landing-content">

        <div className="hero-text">

          <div className="logo-large">
            First<span>Fund</span>

            <div className="logo-icon">
              ₹
            </div>
          </div>


          <p className="tagline">
            Your first salary.
            <br />
            Twelve months.
            <br />
            Zero real risk.
          </p>


          <p className="hero-description">
            Make real financial decisions.
            <br />
            See the consequences.
            <br />
            Learn what actually works.
          </p>


          <button
            className="primary-button"
            onClick={onStart}
          >
            Start Your Journey
            <span>→</span>
          </button>

        </div>


        {/* Temporary visual elements */}
        <div className="finance-illustration">

          <div className="illustration-item">
            💼
          </div>

          <div className="illustration-item">
            📋
          </div>

          <div className="illustration-item">
            🐷
          </div>

          <div className="illustration-item">
            📈
          </div>

          <div className="illustration-item">
            🎯
          </div>

        </div>

      </main>


      {/* Features */}
      <section className="landing-features">

        <div className="feature">
          <div className="feature-icon">◉</div>

          <div>
            <h3>12 Real-life Scenarios</h3>
            <p>Make realistic financial decisions.</p>
          </div>
        </div>


        <div className="feature">
          <div className="feature-icon">✦</div>

          <div>
            <h3>AI Mentor Feedback</h3>
            <p>Get personalized insights for every choice.</p>
          </div>
        </div>


        <div className="feature">
          <div className="feature-icon">↗</div>

          <div>
            <h3>Personalized Insights</h3>
            <p>Understand your habits and grow.</p>
          </div>
        </div>

      </section>


      {activeInfo && (
        <div className="info-modal-backdrop" onClick={closeInfo}>
          <section
            className="info-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="info-modal-close"
              onClick={closeInfo}
              aria-label="Close"
            >
              ×
            </button>

            {activeInfo === "about" ? (
              <>
                <span className="info-modal-eyebrow">ABOUT FIRSTFUND</span>
                <h2 id="info-modal-title">Practice your first year of financial life.</h2>
                <p>
                  FirstFund is a risk-free financial life simulator for your first-job journey.
                  You make realistic money decisions, see their financial consequences, and learn
                  how your habits shape your year-end outcome.
                </p>
                <div className="info-modal-points">
                  <div><strong>12 months</strong><span>of simulated financial life</span></div>
                  <div><strong>Real decisions</strong><span>across savings, spending, debt and risk</span></div>
                  <div><strong>AI mentor</strong><span>personalized feedback on your choices</span></div>
                </div>
              </>
            ) : (
              <>
                <span className="info-modal-eyebrow">HOW IT WORKS</span>
                <h2 id="info-modal-title">Decision → Consequence → Learning</h2>
                <div className="how-steps">
                  <div className="how-step"><span>01</span><div><strong>Build your profile</strong><p>Set your expected salary, city, housing and mentor style.</p></div></div>
                  <div className="how-step"><span>02</span><div><strong>Make a decision</strong><p>Navigate realistic financial situations throughout the year.</p></div></div>
                  <div className="how-step"><span>03</span><div><strong>See the consequence</strong><p>The financial engine updates your savings, debt and net worth.</p></div></div>
                  <div className="how-step"><span>04</span><div><strong>Learn and improve</strong><p>Your AI mentor explains the outcome and highlights better alternatives.</p></div></div>
                </div>
              </>
            )}
          </section>
        </div>
      )}

    </div>
  );
}

export default Landing;