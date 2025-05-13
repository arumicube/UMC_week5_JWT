import {useAuth} from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';



const ProtectedLayout = () => { 
    const {accessToken, loading} = useAuth(); // Loading state to check if authentication is being verified


    if(loading) return <div>Loading...</div>; // Show a loading state while checking authentication

    if (!accessToken) {
        return <Navigate to="/signin" replace />; // Redirect to the login page if not authenticated
    }


  return <Outlet/>; // Render the child routes if authenticated
}
export default ProtectedLayout;