import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return <div className='h-dvh flex flex-col'> 
    {/*h-dvh : 높이, 넓이가 태그 상관없이 전체 화면 차지*/}
        <nav>네비게이션 바 입니다</nav>
        <main className='flex-1'>
            <Outlet />
            {/* Outlet은 라우터에서 설정한 자식 컴포넌트를 렌더링하는 역할을 합니다. */}
        </main>
        <footer>푸터입니다</footer>
    </div>;
};

export default HomeLayout;