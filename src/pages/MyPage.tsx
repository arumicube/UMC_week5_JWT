import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";

export const MyPage = () => {
    const {logout} = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto | null>(null);
    
    useEffect(() => {
        const getData = async () => {
          try {
            const response = await getMyInfo();
            setData(response); // 이거 꼭!
          } catch (err) {
            console.error("회원 정보 조회 실패", err);
            alert("로그인 정보가 만료되었거나 잘못되었습니다.");
          }
        };
      
        getData();
      }, []);
      

    const handleLogout = async () => {
        await logout(); // 로그아웃 처리
        window.location.href = "/"; // 홈으로 이동
    };
    return (
        <div>
            <h1>{data?.data?.name}님 환영합니다.</h1>
            <img src={data?.data?.avatar as string} alt={"구글 로고"} />
            <h1>{data?.data?.email}</h1>

            <button
                className="bg-[#807bff] text-white p-2 rounded-md p-5 cursor-pointer hover:scale-90" 
                onClick={handleLogout}>로그아웃</button>
        </div>
    );
}