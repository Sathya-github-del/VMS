import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisitors } from '../context/VisitorContext';
import NotificationBell from '../components/NotificationBell';
import { employees } from '../data/employees';
import '../styles.css';

const EmployeePanel = () => {
    const navigate = useNavigate();
    const visitorContext = useVisitors();
    const [error, setError] = useState(null);

    // Destructure context only if it exists
    const { visitors, notifications, updateVisitorStatus } = visitorContext || {};
    const [employeeData, setEmployeeData] = useState(null);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    // Load employee data first
    useEffect(() => {
        try {
            const data = localStorage.getItem('employeeData');
            if (!data) {
                throw new Error('No employee data found');
            }
            const parsedData = JSON.parse(data);
            setEmployeeData(parsedData);

            // Set current employee ID for filtering
            const empId = Number(localStorage.getItem('userType')?.split('-')[1]);
            const emp = employees.find(e => e.id === empId);
            if (!emp) {
                throw new Error('Employee not found');
            }
            setCurrentEmployee(emp);
        } catch (err) {
            setError(err.message);
            navigate('/employee-login');
        }
    }, [navigate]);

    // Filter visitors and notifications for current employee only
    const employeeNotifications = notifications?.filter(
        n => n.employeeId === currentEmployee?.id
    );

    const pendingVisitors = visitors?.filter(
        v => v.status === 'pending' && v.employeeId === currentEmployee?.id
    );

    const handleApprove = (visitorId) => {
        updateVisitorStatus(visitorId, 'approved');
        alert('Visitor has been approved. Guard has been notified.');
        setSelectedVisitor(null);
    };

    const handleReject = (visitorId) => {
        updateVisitorStatus(visitorId, 'rejected');
        alert('Visitor has been rejected.');
        setSelectedVisitor(null);
    };

    if (error) {
        return <div className="panel">Error: {error}</div>;
    }

    if (!visitors || !notifications) {
        return <div className="panel">Loading...</div>;
    }

    if (!employeeData || !currentEmployee) {
        return <div className="panel">Loading...</div>;
    }

    return (
        <div className="panel">
            <div className="panel-header">
                <h2 className="panel-title">
                    Employee Panel - {currentEmployee.name} ({currentEmployee.department})
                </h2>
                <NotificationBell />
            </div>

            <div className="visitor-review">
                {selectedVisitor ? (
                    <div className="review-card">
                        <h3>Visitor Details</h3>
                        <div className="visitor-details">
                            <p><strong>Name:</strong> {selectedVisitor.name}</p>
                            <p><strong>Phone:</strong> {selectedVisitor.phone}</p>
                            <p><strong>Email:</strong> {selectedVisitor.email || 'Not provided'}</p>
                            <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
                            {selectedVisitor.photo && (
                                <img
                                    src={selectedVisitor.photo}
                                    alt="Visitor"
                                    className="visitor-photo"
                                />
                            )}
                        </div>
                        <div className="action-buttons">
                            <button
                                onClick={() => handleApprove(selectedVisitor.id)}
                                className="btn btn-success"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(selectedVisitor.id)}
                                className="btn btn-danger"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pending-list">
                        <h3>Pending Approvals ({pendingVisitors.length})</h3>
                        {pendingVisitors.length === 0 ? (
                            <p className="text-center text-gray-600">No pending visitors</p>
                        ) : (
                            pendingVisitors.map(visitor => (
                                <div
                                    key={visitor.id}
                                    className="visitor-card clickable"
                                    onClick={() => setSelectedVisitor(visitor)}
                                >
                                    <h4>{visitor.name}</h4>
                                    <p>Purpose: {visitor.purpose}</p>
                                    <span className="time-ago">
                                        {new Date(visitor.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeePanel;
