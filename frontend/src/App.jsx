import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </>
  );
};

export default App;
