import { Navigate } from "react-router-dom";

/**
 * PrivateRoute component
 * Redirects users to `/login` if they are not authenticated.
 */
export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
