import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

// 1. Context 타입 정의
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // ✅ 추가
}

// 2. Context 생성
export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  loading: true, // ✅ 초기값 true
});

// 3. Provider 정의
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ 추가

  // ✅ 새로고침 or 첫 진입 시 토큰 복구
  useEffect(() => {
    const savedAccessToken = getAccessTokenFromStorage();
    const savedRefreshToken = getRefreshTokenFromStorage();
    setAccessToken(savedAccessToken);
    setRefreshToken(savedRefreshToken);
    setLoading(false); // ✅ 복구 완료 후 로딩 해제
  }, []);

  // ✅ 로그인 처리
  const login = async (signinData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(signinData);
      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        console.log("로그인 성공");
        window.location.href = "/my";
      }
    } catch (error) {
      console.error("로그인 실패", error);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  // ✅ 로그아웃 처리
  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      alert("로그아웃 성공");
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 4. 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider를 찾을 수 없습니다.");
  }
  return context;
};
