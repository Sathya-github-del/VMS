import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [userType, setUserType] = useState(localStorage.getItem('userType'));
    const navigate = useNavigate();

    const login = (type) => {
        setUserType(type);
        localStorage.setItem('userType', type);
        navigate(`/${type.toLowerCase()}`);
    };

    const logout = () => {
        setUserType(null);
        localStorage.removeItem('userType');
        navigate('/');
    };

    return { userType, login, logout };
};
