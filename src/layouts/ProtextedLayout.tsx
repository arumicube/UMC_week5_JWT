import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtextedLayout = () => {
  const { accessToken, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (!accessToken) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtextedLayout;

