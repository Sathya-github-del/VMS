import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    try {
        const employeeData = JSON.parse(localStorage.getItem('employeeData'));
        const userType = localStorage.getItem('userType');

        // Check if all required data is present
        if (!userType ||
            !userType.startsWith('employee-') ||
            !employeeData ||
            !employeeData.id ||
            !employeeData.name) {
            // Clear potentially corrupt data
            localStorage.removeItem('employeeData');
            localStorage.removeItem('userType');
            return <Navigate to="/employee-login" replace />;
        }

        return children;
    } catch (error) {
        // Handle any JSON parse errors
        localStorage.removeItem('employeeData');
        localStorage.removeItem('userType');
        return <Navigate to="/employee-login" replace />;
    }
};

export default ProtectedRoute;
