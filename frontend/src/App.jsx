import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistoryPage from "./pages/InterviewHistoryPage";
import PricingPage from "./pages/PricingPage";
import InterviewReportPage from "./pages/InterviewReportPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/history" element={<InterviewHistoryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/report/:id" element={<InterviewReportPage />} />
      </Routes>
    </>
  );
};

export default App;
