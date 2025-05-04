import { useEffect } from "react";
import { getMyInfo } from "../apis/auth";

export const MyPage = () => {
    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            console.log(response); // 서버에서 내 정보 가져오기
        };

        getData();
    }, []);
    return (
        <div>
        </div>
    );
}