import { useState } from "react";
import Analytics from "../components/Analytics";
import Interview from "../components/Interview";
import RoleExpResume from "../components/RoleExpResume";

const InterviewPage = () => {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 && (
        <RoleExpResume
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Interview
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}
      {step === 3 && <Analytics report={interviewData} />}
    </div>
  );
};

export default InterviewPage;
