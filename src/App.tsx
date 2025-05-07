import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import ProtextedLayout from './layouts/ProtextedLayout';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirectPage';
import { createElement } from 'react';

// 1. 홈페이지
// 2. 로그인페이지
// 3. 회원가입 페이지

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },
  {
    path: "/v1/auth/google/callback",
    element: createElement(GoogleLoginRedirectPage), // ✅ 이렇게 변경
  },
];


const privateRoutes:RouteObject[] = [
  {
    path: "/",
    element: <ProtextedLayout />,
    errorElement: <NotFoundPage  />,
    children: [{
      path: 'my', element: <MyPage />},
    ],
  },
]

const router = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
  
  ]);

function App() {
  return(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>

  );
}

export default App
