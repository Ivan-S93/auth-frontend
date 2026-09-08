import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { user, token } = useAuth();

    if (!token || !user ) {
        // si no hay token o usuario , redrige al login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => user.roles?.includes(role))) {
        return <Navigate to="/login" replace />; 
        // si el usuario no tiene los roles permitidos, redirige al login de vuelta
    }

    return <Outlet />; // Renderiza los componentes hijos si el usuario esta autenticado y tiene los roles permitidos
}