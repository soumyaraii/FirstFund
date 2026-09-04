import "./ProfileReady.css";

function ProfileReady({ profile, onBegin, loading }) {
  const salaryLabels = {
    "3-5_LPA": "3–5 LPA",
    "5-8_LPA": "5–8 LPA",
    "8-12_LPA": "8–12 LPA",
    "12-18_LPA": "12–18 LPA",
    "18_PLUS_LPA": "18+ LPA",
  };

  const cityLabels = {
    metro: "Metro (Tier 1)",
    tier_2: "Tier 2 City",
    tier_3: "Tier 3 City",
  };

  const housingLabels = {
    home: "Living with Family",
    pg: "PG / Shared Room",
    renting: "Independent / Rented Flat",
  };

  const mentorLabels = {
    strict: "Strict Mentor",
    supportive: "Supportive Friend",
    analyst: "Data-Driven Analyst",
  };

  return (
    <div className="profile-ready-page">
      <header className="profile-header">
        <div className="profile-logo">
          First<span>Fund</span>
        </div>

        <div className="profile-step">
          PROFILE <span>READY</span>
        </div>
      </header>

      <main className="profile-container">
        <div className="profile-intro">
          <div className="profile-eyebrow">
            YOUR FINANCIAL PROFILE
          </div>

          <h1>
            You're ready to<br />
            begin your year.
          </h1>

          <p>
            Your simulation has been personalized around
            your financial profile and guidance preferences.
          </p>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <span>01</span>
            <div>
              <small>STARTING SALARY</small>
              <strong>{salaryLabels[profile.salaryRange]}</strong>
            </div>
          </div>

          <div className="profile-card">
            <span>02</span>
            <div>
              <small>LOCATION</small>
              <strong>{cityLabels[profile.cityTier]}</strong>
            </div>
          </div>

          <div className="profile-card">
            <span>03</span>
            <div>
              <small>HOUSING</small>
              <strong>{housingLabels[profile.housing]}</strong>
            </div>
          </div>

          <div className="profile-card">
            <span>04</span>
            <div>
              <small>MENTOR</small>
              <strong>{mentorLabels[profile.mentorPersona]}</strong>
            </div>
          </div>
        </div>

        <div className="profile-action">
          <button onClick={onBegin} disabled={loading}>
            {loading ? "Starting Your Financial Year..." : "Begin My Financial Year"}
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default ProfileReady;