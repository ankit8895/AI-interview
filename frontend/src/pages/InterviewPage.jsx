import { useEffect, useState } from "react";
import Analytics from "../components/Analytics";
import Interview from "../components/Interview";
import RoleExpResume from "../components/RoleExpResume";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedReport } from "../redux/reducers/reportsReducer";

const InterviewPage = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const { questions, report } = useSelector((state) => state.interviewReducer);

  // When questions are loaded in store → move to interview step
  useEffect(() => {
    if (questions.length > 0 && step === 1) setStep(2);
  }, [questions]);

  // When report is available in store → move to analytics step
  useEffect(() => {
    if (report && step === 2) {
      dispatch(setSelectedReport(report));
      setStep(3);
    }
  }, [report]);

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && <RoleExpResume />}
      {step === 2 && <Interview />}
      {step === 3 && <Analytics />}
    </div>
  );
};

export default InterviewPage;
