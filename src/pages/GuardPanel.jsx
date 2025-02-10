import { useState } from 'react';
import '../styles.css';
import { useVisitors } from '../context/VisitorContext';
import NotificationBell from '../components/NotificationBell';

const GuardPanel = () => {
    const { visitors, checkInVisitor, checkOutVisitor, notifications } = useVisitors();
    const [visitorStatus, setVisitorStatus] = useState('all'); // New state for filtering

    // Filter notifications for guard
    const guardNotifications = notifications.filter(n => n.type === 'guard');

    // Filter visitors based on status
    const getFilteredVisitors = () => {
        switch (visitorStatus) {
            case 'approved':
                return visitors.filter(v => v.status === 'approved');
            case 'rejected':
                return visitors.filter(v => v.status === 'rejected');
            case 'checked-in':
                return visitors.filter(v => v.checkIn && !v.checkOut);
            default:
                return visitors.filter(v => v.status === 'approved' || v.status === 'rejected');
        }
    };

    const filteredVisitors = getFilteredVisitors();

    const handleCheckIn = (visitorId) => {
        checkInVisitor(visitorId);
        alert('Visitor checked in successfully!');
        setSelectedVisitor(null);
    };

    const handleCheckOut = (visitorId) => {
        checkOutVisitor(visitorId);
        alert('Visitor checked out successfully!');
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <h2 className="panel-title">Guard Panel</h2>
                <NotificationBell filterType="guard" />
            </div>

            {/* Status Filter */}
            <div className="status-filter-container mb-4">
                <select
                    value={visitorStatus}
                    onChange={(e) => setVisitorStatus(e.target.value)}
                    className="form-input"
                >
                    <option value="all">All Visitors</option>
                    <option value="approved">Approved Only</option>
                    <option value="rejected">Rejected Only</option>
                    <option value="checked-in">Currently Checked In</option>
                </select>
            </div>

            {/* Notifications Section */}
            <div className="recent-notifications">
                <h3>Recent Approvals</h3>
                {guardNotifications.map(notification => (
                    <div key={notification.id} className="notification-card">
                        <div className="notification-header">
                            <span className="notification-badge new">New</span>
                            <span className="notification-time">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                        <p><strong>{notification.visitor.name}</strong> has been approved</p>
                        <button
                            className="btn btn-success"
                            onClick={() => handleCheckIn(notification.visitor.id)}
                        >
                            Check In
                        </button>
                    </div>
                ))}
            </div>

            {/* Visitors List */}
            <div className="visitor-list">
                <h3>{visitorStatus === 'all' ? 'All Visitors' :
                    visitorStatus === 'approved' ? 'Approved Visitors' :
                        visitorStatus === 'rejected' ? 'Rejected Visitors' :
                            'Checked-In Visitors'}
                </h3>
                {filteredVisitors.map((visitor) => (
                    <div key={visitor.id} className="visitor-card">
                        <div className="visitor-info">
                            <h4>{visitor.name}</h4>
                            <p>Visiting: {visitor.visitingMember}</p>
                            <p>Purpose: {visitor.purpose}</p>
                            <span className={`status status-${visitor.status}`}>
                                {visitor.status}
                            </span>
                            {visitor.status === 'approved' && !visitor.checkIn && (
                                <button
                                    onClick={() => checkInVisitor(visitor.id)}
                                    className="btn btn-success mt-2"
                                >
                                    Check In
                                </button>
                            )}
                            {visitor.checkIn && !visitor.checkOut && (
                                <button
                                    onClick={() => checkOutVisitor(visitor.id)}
                                    className="btn btn-danger mt-2"
                                >
                                    Check Out
                                </button>
                            )}
                        </div>
                        {visitor.photo && (
                            <img
                                src={visitor.photo}
                                alt="Visitor"
                                className="visitor-photo"
                            />
                        )}
                    </div>
                ))}
                {filteredVisitors.length === 0 && (
                    <p className="text-center text-gray-600 mt-4">
                        No visitors found for selected status
                    </p>
                )}
            </div>
        </div>
    );
};

export default GuardPanel;
