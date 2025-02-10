import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [userType, setUserType] = useState(localStorage.getItem('userType'));
    const navigate = useNavigate();

    // Check auth status on mount and route changes
    useEffect(() => {
        const savedUserType = localStorage.getItem('userType');
        const employeeData = localStorage.getItem('employeeData');

        if (savedUserType?.startsWith('employee-') && employeeData) {
            setUserType(savedUserType);
            if (window.location.pathname === '/employee-login') {
                navigate('/employee');
            }
        }
    }, [navigate]);

    const login = (type) => {
        setUserType(type);
        localStorage.setItem('userType', type);
        navigate(`/${type.split('-')[0]}`);
    };

    const logout = () => {
        setUserType(null);
        localStorage.removeItem('userType');
        localStorage.removeItem('employeeData');
        navigate('/');
    };

    return { userType, login, logout };
};
