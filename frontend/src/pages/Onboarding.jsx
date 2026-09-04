import { useState } from "react";
import "./Onboarding.css";

const steps = [
  {
    key: "salaryRange",
    number: "01",
    title: "What's your expected starting salary?",
    description:
      "Select the range that best represents your expected starting income.",
    options: [
      { value: "3-5_LPA", label: "3–5 LPA" },
      { value: "5-8_LPA", label: "5–8 LPA" },
      { value: "8-12_LPA", label: "8–12 LPA" },
      { value: "12-18_LPA", label: "12–18 LPA" },
      { value: "18_PLUS_LPA", label: "18+ LPA" },
    ],
  },
  {
    key: "cityTier",
    number: "02",
    title: "Where will you be living?",
    description:
      "Select the city category that best represents your expected place of residence.",
    options: [
      { value: "metro", label: "Metro", sublabel: "Tier 1 City" },
      { value: "tier_2", label: "Tier 2 City" },
      { value: "tier_3", label: "Tier 3 City" },
    ],
  },
  {
    key: "housing",
    number: "03",
    title: "What is your expected housing arrangement?",
    description:
      "Select the housing arrangement you expect to maintain during your first year.",
    options: [
      {
        value: "home",
        label: "Living with Family",
        icon: "⌂",
      },
      {
        value: "pg",
        label: "PG / Shared Room",
        icon: "⌂",
      },
      {
        value: "renting",
        label: "Independent / Rented Flat",
        icon: "⌂",
      },
    ],
  },
  {
    key: "mentorPersona",
    number: "04",
    title: "Choose your financial mentor",
    description:
      "Select the guidance style you prefer throughout your financial journey.",
    options: [
      {
        value: "strict",
        label: "Strict Mentor",
        description:
          "Provides direct, disciplined feedback focused on financial responsibility.",
      },
      {
        value: "supportive",
        label: "Supportive Friend",
        description:
          "Provides encouraging guidance focused on confidence and sustainable financial habits.",
      },
      {
        value: "analyst",
        label: "Data-Driven Analyst",
        description:
          "Provides objective insights based on financial outcomes, patterns, and projections.",
      },
    ],
  },
];

function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const [profile, setProfile] = useState({
    salaryRange: "",
    cityTier: "",
    housing: "",
    mentorPersona: "",
  });

  const step = steps[currentStep];

  const selectedValue = profile[step.key];

  const handleSelect = (value) => {
    setProfile((previous) => ({
      ...previous,
      [step.key]: value,
    }));
  };

  const handleContinue = () => {
    if (!selectedValue) return;

    if (currentStep === steps.length - 1) {
      console.log("Final profile:", profile);
      onComplete(profile);
      return;
    }

    setCurrentStep((previous) => previous + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;

    setCurrentStep((previous) => previous - 1);
  };

  return (
    <div className="onboarding-page">

      {/* HEADER */}
      <header className="onboarding-header">

        <div className="onboarding-logo">
          First<span>Fund</span>
        </div>

        <div className="step-count">
          {step.number} <span>/ 04</span>
        </div>

      </header>


      {/* PROGRESS */}
      <div className="progress-container">
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>


      {/* MAIN */}
      <main className="onboarding-container">

        <div className="onboarding-content">

          {/* EYEBROW */}
          <div className="onboarding-eyebrow">
            BUILD YOUR PROFILE
          </div>


          {/* HEADING */}
          <h1>{step.title}</h1>

          <p className="onboarding-description">
            {step.description}
          </p>


          {/* OPTIONS */}
          <div
            className={`onboarding-options ${
              step.key === "mentorPersona"
                ? "mentor-options"
                : ""
            }`}
          >

            {step.options.map((option) => {

              const isSelected =
                selectedValue === option.value;

              return (
                <button
                  key={option.value}
                  className={`selection-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() =>
                    handleSelect(option.value)
                  }
                >

                  {/* Housing icon */}
                  {option.icon && (
                    <div className="selection-icon">
                      {option.icon}
                    </div>
                  )}


                  <div className="selection-text">

                    <div className="selection-title">
                      {option.label}

                      {option.sublabel && (
                        <span className="selection-sublabel">
                          {option.sublabel}
                        </span>
                      )}
                    </div>

                    {option.description && (
                      <div className="selection-description">
                        {option.description}
                      </div>
                    )}

                  </div>


                  {/* Check */}
                  <div className="selection-check">
                    {isSelected ? "✓" : ""}
                  </div>

                </button>
              );
            })}

          </div>


          {/* NAVIGATION */}
          <div className="onboarding-navigation">

            <button
              className="back-button"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              ← Back
            </button>

            <button
              className={`continue-button ${
                selectedValue ? "active" : ""
              }`}
              onClick={handleContinue}
              disabled={!selectedValue}
            >
              {currentStep === steps.length - 1
                ? "Begin My Year"
                : "Continue"}

              <span>→</span>
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Onboarding;