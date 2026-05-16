import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Analytics from "../components/Analytics";
import { fetchInterviewReport } from "../redux/reducers/reportsReducer";

const InterviewReportPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedReport, loading } = useSelector(
    (state) => state.reportsReducer,
  );

  useEffect(() => {
    dispatch(fetchInterviewReport(id));
  }, [dispatch, id]);

  if (loading || !selectedReport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }
  return <Analytics />;
};

export default InterviewReportPage;
