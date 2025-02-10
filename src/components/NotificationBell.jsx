import { useState } from 'react';
import { useVisitors } from '../context/VisitorContext';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications } = useVisitors();
    const currentEmployeeId = Number(localStorage.getItem('userType')?.split('-')[1]);

    // Filter notifications for current employee
    const employeeNotifications = notifications.filter(n =>
        n.employeeId === currentEmployeeId
    );

    const unreadCount = employeeNotifications.filter(n => !n.read).length;

    return (
        <div className="notification-container">
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="bell-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && employeeNotifications.length > 0 && (
                <div className="notification-dropdown">
                    {employeeNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-item ${!notification.read ? 'unread' : ''}`}
                        >
                            <div className="notification-content">
                                <p className="visitor-name">{notification.visitor.name}</p>
                                <p className="visit-purpose">
                                    {notification.type === 'guard'
                                        ? 'Approved - Ready for Check-in'
                                        : `Purpose: ${notification.visitor.purpose}`
                                    }
                                </p>
                            </div>
                            <span className="notification-time">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;

