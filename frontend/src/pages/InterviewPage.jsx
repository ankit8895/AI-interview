import { useEffect, useState } from "react";
import Analytics from "../components/Analytics";
import Interview from "../components/Interview";
import RoleExpResume from "../components/RoleExpResume";
import { useSelector } from "react-redux";

const InterviewPage = () => {
  const [step, setStep] = useState(1);
  const { questions, interviewId, report } = useSelector(
    (state) => state.interviewReducer,
  );

  // When questions are loaded in store → move to interview step
  useEffect(() => {
    if (questions.length > 0 && step === 1) setStep(2);
  }, [questions]);

  // When report is available in store → move to analytics step
  useEffect(() => {
    if (report && step === 2) setStep(3);
  }, [report]);

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <RoleExpResume
        // onStart={(data) => {
        //   setInterviewData(data);
        //   setStep(2);
        // }}
        />
      )}
      {step === 2 && (
        <Interview
        // // interviewData={interviewData}
        // onFinish={(report) => {
        //   // setInterviewData(report);
        //   setStep(3);
        // }}
        />
      )}
      {step === 3 && (
        <Analytics
        // report={interviewData}
        />
      )}
    </div>
  );
};

export default InterviewPage;
