import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateSignin, // ✅ 오타 수정: validaite -> validate
  });

  const handleSubmit = async () => {
    try {
      await login(values);
      window.location.href = "/my";
    } catch (error) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <span className="text-sm">이전</span>
      </div>

      <h1 className="text-2xl font-bold">로그인</h1>

      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          type="email"
          className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.email && touched?.email
              ? "border-red-500 bg-red-200"
              : "border-[#ccc]"
          }`}
          placeholder="이메일"
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          type="password"
          className={`border w-[300px] p-[10px] focus:border-[#807bff] rounded-sm ${
            errors?.password && touched?.password
              ? "border-red-500 bg-red-200"
              : "border-[#ccc]"
          }`}
          placeholder="비밀번호"
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-[#807bff] text-white p-[10px] rounded-sm hover:bg-[#807bff]/80 transition-all duration-200 ease-in-out disabled:bg-[gray]/50"
        >
          로그인
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-[#807bff] text-white p-[10px] rounded-sm hover:bg-[#807bff]/80 transition-all duration-200 ease-in-out"
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src="https://w7.pngwing.com/pngs/869/485/png-transparent-google-logo-computer-icons-google-text-logo-google-logo-thumbnail.png"
              alt="Google 로고"
              className="w-5 h-5"
              loading="lazy"
            />
            구글 로그인
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
