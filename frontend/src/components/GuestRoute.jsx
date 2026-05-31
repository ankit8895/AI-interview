import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Wraps guest-only routes (/auth).
 * Redirects already-authenticated users to home.
 */
const GuestRoute = () => {
  const { userInfo } = useSelector((state) => state.userReducer);
  const location = useLocation();

  if (userInfo) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
