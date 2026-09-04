import { useState } from "react";

import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import ProfileReady from "./pages/ProfileReady";
import Simulation from "./pages/Simulation";
import Consequence from "./pages/Consequence";
import FinalScorecard from "./pages/FinalScorecard";
import { getScorecard, startSimulation, submitDecision } from "./services/api";

function App() {
  const [page, setPage] = useState("landing");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [simulationData, setSimulationData] = useState(null);
  const [consequenceData, setConsequenceData] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);

  const handleOnboardingComplete = (profileData) => {
    setError("");
    setProfile(profileData);
    setPage("profileReady");
  };

  const handleBeginSimulation = async () => {
    if (!profile) return;

    setLoading(true);
    setError("");

    try {
      const data = await startSimulation(profile);

      setSimulationData({
        sessionId: data.sessionId,
        mentorPersona: data.mentorPersona || profile.mentorPersona,
        currentState: data.currentState,
        currentScenario: data.currentScenario,
        trajectory: [
          {
            month: data.currentState?.month || 1,
            netWorth: data.currentState?.netWorth || 0,
          },
        ],
      });

      setPage("simulation");
    } catch (err) {
      setError(err.message || "Unable to start the simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (choiceId) => {
    if (!simulationData?.currentScenario || loading) return;

    const { sessionId, currentScenario, mentorPersona } = simulationData;

    setLoading(true);
    setError("");

    try {
      const response = await submitDecision({
        sessionId,
        month: currentScenario.month,
        choiceId,
        mentorPersona,
      });

      // ---- UPDATED: backend now returns flat top-level fields ----
      // (previousState, newState, immediateImpact, projected12MonthImpact)
      // instead of everything nested under `financialState`.
      const { previousState, newState, immediateImpact, projected12MonthImpact, aiFeedback } =
        response;

      if (!newState) {
        throw new Error("The backend did not return the updated financial state.");
      }

      setSimulationData((previousData) => ({
        ...previousData,
        currentState: newState,
        currentScenario: response.nextScenario,
        trajectory: [
          ...(previousData.trajectory || []),
          {
            month: response.month,
            netWorth: newState.netWorth,
          },
        ],
      }));

      setConsequenceData({
        month: response.month,
        choiceText:
          currentScenario.options.find((option) => option.id === choiceId)?.text ||
          "Your selected decision",
        immediateImpact: immediateImpact || {},
        // projected12MonthImpact is now an object { netWorthDelta } — pull out the number
        projectedImpact: projected12MonthImpact?.netWorthDelta ?? 0,
        explanation: aiFeedback?.explanation || "",
        lesson: aiFeedback?.lesson || "",
        alternativeComparison: aiFeedback?.alternativeComparison || "",
        forwardTip: aiFeedback?.forwardTip || "",
        // alternativePaths now lives inside aiFeedback (only present on months 6 & 7)
        alternativePaths: aiFeedback?.alternativePaths || null,
        nextScenario: response.nextScenario || null,
        previousState,
        newState,
      });

      setPage("consequence");
    } catch (err) {
      setError(err.message || "Unable to process that decision.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToNextMonth = async () => {
    if (!simulationData) return;

    if (!simulationData.currentScenario) {
      setLoading(true);
      setError("");

      try {
        const scorecard = await getScorecard(simulationData.sessionId);
        setScorecardData(scorecard);
        setPage("scorecard");
      } catch (err) {
        setError(err.message || "Unable to load your scorecard.");
      } finally {
        setLoading(false);
      }

      return;
    }

    setPage("simulation");
  };

  const handleRestart = () => {
    setProfile(null);
    setSimulationData(null);
    setConsequenceData(null);
    setScorecardData(null);
    setError("");
    setPage("landing");
  };

  const errorBanner = error ? (
    <div className="app-error" role="alert">
      <span>{error}</span>
      <button onClick={() => setError("")}>×</button>
    </div>
  ) : null;

  if (page === "landing") {
    return (
      <>
        {errorBanner}
        <Landing onStart={() => setPage("onboarding")} />
      </>
    );
  }

  if (page === "onboarding") {
    return (
      <>
        {errorBanner}
        <Onboarding onComplete={handleOnboardingComplete} />
      </>
    );
  }

  if (page === "profileReady") {
    return (
      <>
        {errorBanner}
        <ProfileReady
          profile={profile}
          onBegin={handleBeginSimulation}
          loading={loading}
        />
      </>
    );
  }

  if (page === "simulation" && simulationData) {
    return (
      <>
        {errorBanner}
        <Simulation
          simulationData={simulationData}
          onDecision={handleDecision}
          loading={loading}
        />
      </>
    );
  }

  if (page === "consequence" && consequenceData) {
    return (
      <>
        {errorBanner}
        <Consequence
          consequenceData={consequenceData}
          onContinue={handleContinueToNextMonth}
          loading={loading}
        />
      </>
    );
  }

  if (page === "scorecard" && scorecardData) {
    return (
      <>
        {errorBanner}
        <FinalScorecard scorecard={scorecardData} onRestart={handleRestart} />
      </>
    );
  }

  return null;
}

export default App;
