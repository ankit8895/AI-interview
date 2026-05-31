import { Route, Routes } from "react-router-dom";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import InterviewHistoryPage from "./pages/InterviewHistoryPage";
import InterviewPage from "./pages/InterviewPage";
import InterviewReportPage from "./pages/InterviewReportPage";
import PricingPage from "./pages/PricingPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/reducers/userReducer";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.userReducer);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <Routes>
      {/* Public routes — accessible by anyone */}
      <Route path="/" element={<HomePage />} />

      {/* Guest-only — logged-in users are redirected to / */}
      <Route element={<GuestRoute />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Protected — unauthenticated users are redirected to /auth */}
      <Route element={<ProtectedRoute />}>
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/history" element={<InterviewHistoryPage />} />
        <Route path="/report/:id" element={<InterviewReportPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>
    </Routes>
  );
};

export default App;
