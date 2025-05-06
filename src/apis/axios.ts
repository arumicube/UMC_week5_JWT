import { set } from 'react-hook-form';
// src/apis/axios.ts

import axios, { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";


interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig{
    retry?: boolean; // 재시도 여부
}
//전역 변수로 refresh 요청의 promise를 저장하여 중복요청을 방지
let refreshPromise:Promise<string>|null = null; // 초기값 null로 설정
// => const로 하면 오류남
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // API URL
  withCredentials: true, // 이거는 쿠키용 옵션
});



// ✅ 인터셉터: 요청 전에 토큰 자동으로 붙이기
axiosInstance.interceptors.request.use((config) => {
  const acessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  //if (token && token !== "null") {
//  config.headers.Authorization = `Bearer ${token}`;
//  } 원래 인터셉트

// accessToken이 존재하면 Authorization 헤더에 Bearer 토큰 추가
    if (acessToken) {
        config.headers =config.headers || {}; // headers가 undefined일 경우를 대비
        config.headers.Authorization = `Bearer ${acessToken}`; // Bearer 토큰 추가
    }
  return config;
},
(error) => {
  return Promise.reject(error); // 요청 에러 처리
});

// ✅ 인터셉터: 401 에러 발생 시 refresh 토큰 갱신 응답 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest:CustomInternalAxiosRequestConfig = error.config;

        //401 에러가 발생 & 아직 재시도 안함
        if(error.response && 
            error.response.status === 401 &&
            // custom error가 추가되면 여기에 넣어야함!!!!
             !originalRequest.retry) {
            // refresh 엔드포인트 401 에러가 발생한 경우, 중복 재시도 방지를 위해 로그아웃 처리
            if(originalRequest.url === "/v1/auth/refresh"){

                const {removeItem: removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const {removeItem: removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                removeAccessToken();
                removeRefreshToken();
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
                return Promise.reject(error); // 에러 반환
            }

            //재시도 플래그 설정
            originalRequest.retry = true; // 재시도 플래그 설정

            // 이미 리프레시 진행 중이면, 그 promise를 재사용
            if(!refreshPromise) {
                refreshPromise = (async()=>{
                    const {getItem:getRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = getRefreshToken(); // 로컬 스토리지에서 refreshToken 가져오기
                    const {data} = await axiosInstance.post("/v1/auth/refresh", {refresh:refreshToken}); // refreshToken으로 accessToken 재발급 요청
                    //새 토큰 반환
                    const {setItem:setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const {setItem:setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    setAccessToken(data.data.accessToken); // 새로운 accessToken 저장
                    setRefreshToken(data.data.refreshToken); // 새로운 refreshToken 저장
                    return data.data.accessToken; // 새로운 accessToken 반환

                })() // 즉시 실행 함수
                .catch((error) =>{
                    const {removeItem: removeAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const {removeItem: removeRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    removeAccessToken(); // accessToken 삭제
                    removeRefreshToken(); // refreshToken 삭제
                }).finally(()=>{
                    refreshPromise = null; // 리프레시 완료 후 promise 초기화
                });
            }
            //진행 중인 refreshPromise가 해결될 떄까지 기다림
            return refreshPromise.then((newAccessToken) => {
                //갱신토근으로 업데이트
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // 새로운 accessToken으로 요청 헤더 업데이트
                // = originalRequest.headers.Authorization
                //업데이트 요청 재시도
                return axiosInstance.request(originalRequest); // 원래 요청 재전송
        });
    }
    //401 에러가 아닌 경우, 에러 반환
        return Promise.reject(error); // 에러 반환
    },

);
