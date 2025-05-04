import { postSignin } from "../apis/auth";
import useForm from "../hooks/useForm";
import { UserSigninInformation, validateSignin } from "../utils/validate";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const LoginPage = () => {
  const { setItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: "",
      password: "",
    },
    validaite: validateSignin,
  });

  const handleSubmit = async () => {
    console.log(values);
    try {
      const response = await postSignin(values); // 서버에 로그인 요청
      setItem(response.data.accessToken); // accessToken 로컬스토리지 저장
      console.log(response); // 응답 출력
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error("Unknown error:", error);
        alert("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.history.back()}>
        <span className="text-sm">이전</span>
      </div>
      <h1 className="text-2xl font-bold">로그인</h1>
      <div className="flex flex-col gap-3">
        <input
          {...getInputProps("email")}
          type={"email"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"이메일"}
        />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
          {...getInputProps("password")}
          type={"password"}
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
            ${errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
          placeholder={"비밀번호"}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full bg-[#807bff] text-white p-[10px] rounded-sm hover:bg-[#807bff]/80 transition-all duration-200 ease-in-out disabled:bg-[gray]/50`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
