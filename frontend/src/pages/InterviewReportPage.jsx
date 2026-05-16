import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Analytics from "../components/Analytics";

const InterviewReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axiosInstance.get("/api/interview/report/" + id);
        setReport(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReport();
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }
  return <Analytics report={report} />;
};

export default InterviewReportPage;
