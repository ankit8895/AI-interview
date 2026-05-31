import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/*
 * Wraps protected routes. Redirects unauthenticated users to /auth
 * and preserves the attempted URL so they can be sent back after login.
 */
const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.userReducer);
  const location = useLocation();

  if (!userInfo) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
