import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const ProtextedLayout = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // accessToken이 바뀌거나 초기화될 때 로딩 끝낸다고 가정
    setLoading(false);
  }, [accessToken]);

  // 아직 accessToken 판단 안 된 상태면 아무것도 안 보여줌
  if (loading) return <div>로딩 중...</div>;

  // 토큰 없으면 로그인 페이지로
  if (!accessToken) return <Navigate to="/login" replace />;

  // 토큰 있으면 하위 라우트 출력
  return <Outlet />;
};

export default ProtextedLayout;


