import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";

const schema = z.object({
  email:z.string().email({message:"이메일 형식에 맞지 않습니다."}),
  password:z.string().min(8, {message:"비밀번호는 8자리 이상이어야 합니다."})
  .max(20, {message:"비밀번호는 20자리 이하이어야 합니다."

  }),
  passwordCheck:z.string().min(8, {message:"비밀번호 확인은 8자리 이상이어야 합니다."})
  .max(20, {message:"비밀번호 확인은 20자리 이하이어야 합니다."}),
  name:z.string().min(1, {message:"이름은 1자리 이상이어야 합니다."}),
})
  .refine((data)=> data.password === data.passwordCheck, {
    message:"비밀번호가 일치하지 않습니다.",
    path:["passwordCheck"],
  
});

type FormFields = z.infer<typeof schema>; //zod 스키마를 통해 타입을 추론한다.

const SignupPage = () => {
  const {register, handleSubmit, formState: {errors, isSubmitting},} = useForm({
    defaultValues:{
      email:"",
      password:"",
      name:"",
      passwordCheck:"",
    },
    resolver: zodResolver(schema),
    mode:"onBlur", //onBlur: 포커스가 벗어날 때 유효성 검사
  })

  const onSubmit:SubmitHandler<FormFields> =async (data) => {
    const {passwordCheck, ...rest} = data; //비밀번호 확인을 제외한 나머지 데이터

    const response : ResponseSignupDto=await postSignup(rest);

    console.log(response); //서버에 회원가입 요청을 보낸다.
  }


  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
    {/*이전 페이지*/}
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.history.back()}>
      <span className="text-sm">이전</span>
    </div>
    {/*로그인 페이지*/}
    <h1 className="text-2xl font-bold">회원가입</h1>
    <div className="flex flex-col gap-3">
      <input 
            {...register('email')} //이메일 인풋 속성들
            type={"email"}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
              ${errors?.email ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"이메일"}/>
      
      {errors?.email && (<div className={'text-red-500 text-sm'}>{errors.email.message}</div>)}

      <input 
            {...register("password")} //패스워드 인풋 속성들
            type={"password"} 
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
              ${errors?.password ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"비밀번호"}/>
            
      {errors?.password && (<div className={'text-red-500 text-sm'}>{errors.password.message}</div>)}

      <input 
            {...register("passwordCheck")} //패스워드 인풋 속성들
            type={"password"} 
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
              ${errors?.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"비밀번호 확인"}/>
            
      {errors?.passwordCheck && (<div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>)}


      <input 
            {...register("name")} //패스워드 인풋 속성들
            type={"name"}
            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
              ${errors?.name ? "border-red-500 bg-red-200" : "border-gray-300"}`}
            placeholder={"이름"}/>


      {errors?.name && (<div className={'text-red-500 text-sm'}>{errors.name.message}</div>)}

      <button 
              disabled={isSubmitting} //서버에 요청을 보낼 때 버튼 비활성화
              type="button" 
              onClick={handleSubmit(onSubmit)} //폼 데이터가 유효할 때 실행되는 함수
              className={`w-full bg-[#807bff] text-white p-[10px] rounded-sm hover:bg-[#807bff]/80 transition-all duration-200 ease-in-out disabled:bg-[gray]/50`}>
        회원가입
      </button>
    </div>
  </div>
  );
}

export default SignupPage;