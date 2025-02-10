import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles.css';
import { employees } from '../data/employees';
import { useState } from 'react';
const Homepage = () => {
    const navigate = useNavigate();
    const { login, userType } = useAuth();
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const cards = [
        {
            title: "New Visitor",
            icon: "M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z",
            description: "Register as a new visitor",
            path: "/new-visitor",
            role: null
        },
        {
            title: "Existing Visitor",
            icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0z",
            description: "Check your visit status",
            path: "/existing-visitor",
            role: null
        },
        {
            title: "Admin Dashboard",
            icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            description: "Manage visitors and analytics",
            path: "/admin",
            role: "admin"
        },
        {
            title: "Employee Panel",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            description: "Review and approve visitors",
            path: "/employee",
            role: "employee"
        },
        {
            title: "Guard Panel",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            description: "Check-in and check-out visitors",
            path: "/guard",
            role: "guard"
        }
    ];

    const handleCardClick = (card) => {
        if (card.role === 'employee') {
            navigate('/employee-login');
        } else if (card.role) {
            login(card.role);
        } else {
            navigate(card.path);
        }
    };

    const handleEmployeeLogin = (employeeId) => {
        login(`employee-${employeeId}`);
        setShowEmployeeModal(false);
    };

    const handleResetData = () => {
        if (window.confirm('Are you sure? This will delete ALL visitor data and cannot be undone!')) {
            // Clear all localStorage data
            localStorage.removeItem('visitors');
            localStorage.removeItem('notifications');
            localStorage.removeItem('visitorProfiles');
            localStorage.removeItem('employeeData');
            localStorage.removeItem('userType');

            // Reload the page to reset all states
            window.location.reload();
        }
    };

    return (
        <div className="container">
            <nav className="main-nav">
                <div className="nav-logo">
                    <img src='src/assets/dynpro.jpg' alt='website logo' style={{ height: '50px' }} />
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/new-visitor" className="nav-link">New Visitor</Link>
                    <Link to="/existing-visitor" className="nav-link">Existing Visitor</Link>
                    <Link to="/admin" className="nav-link">Admin</Link>
                    <Link to="/employee-login" className="nav-link">Employee</Link>
                    <Link to="/guard" className="nav-link">Guard</Link>
                </div>
            </nav>

            <h1 className="page-title">Guest Management</h1>
            <div className='logo' style={{ textAlign: 'center' }}>
                <img src='src/assets/dynpro.jpg' alt='website logo' />
            </div>

            {/* Reset Data Button */}
            <div className="text-center mb-4">
                <button style={{ backgroundColor: '#f4f4f4', color: '#f4f4f4' }}
                    onClick={() => setShowResetModal(true)}
                    className="btn btn-danger"
                >
                    Reset All Data
                </button>
            </div>

            <div className="cards-grid">
                {cards.filter(card => !card.role || !userType).map((card, index) => (
                    <div
                        key={index}
                        className="card hover-card"
                        onClick={() => handleCardClick(card)}
                    >
                        <div className="card-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                            </svg>
                        </div>
                        <h2 className="card-title">{card.title}</h2>
                        <p className="card-text">{card.description}</p>
                    </div>
                ))}
            </div>

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Reset All Data</h3>
                        <p className="text-danger">Warning: This action cannot be undone!</p>
                        <p>This will delete all:</p>
                        <ul className="reset-list">
                            <li>Visitor records</li>
                            <li>Notifications</li>
                            <li>User sessions</li>
                            <li>Stored profiles</li>
                        </ul>
                        <div className="modal-actions">
                            <button
                                onClick={handleResetData}
                                className="btn btn-danger"
                            >
                                Yes, Reset Everything
                            </button>
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEmployeeModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Select Employee</h3>
                        <select
                            className="form-input"
                            onChange={(e) => handleEmployeeLogin(e.target.value)}
                        >
                            <option value="">Select your name</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name} - {emp.department}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
