import { useState } from 'react';
import { useVisitors } from '../context/VisitorContext';
import AdminDashboardStats from '../components/AdminDashboardStats';

const AdminPanel = () => {
    const { visitors, deleteVisitor } = useVisitors();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedVisitorId, setSelectedVisitorId] = useState(null);

    const filteredVisitors = visitors.filter(visitor => {
        const matchesSearch = (
            visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.phone.includes(searchTerm) ||
            visitor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = filterStatus === 'all' || visitor.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleDeleteClick = (id) => {
        setSelectedVisitorId(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteVisitor(selectedVisitorId);
        setShowDeleteConfirm(false);
        setSelectedVisitorId(null);
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Phone', 'Email', 'Purpose', 'Status', 'Check In', 'Check Out'];
        const data = filteredVisitors.map(v => [
            v.name,
            v.phone,
            v.email || 'N/A',
            v.purpose,
            v.status,
            v.checkIn ? new Date(v.checkIn).toLocaleString() : 'N/A',
            v.checkOut ? new Date(v.checkOut).toLocaleString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visitors-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="admin-panel">
            <div className="panel-header">
                <h1 className="panel-title">Admin Dashboard</h1>
                <button onClick={exportToCSV} className="btn btn-primary">
                    Export Data
                </button>
            </div>

            <AdminDashboardStats />

            <div className="filters-section">
                <input
                    type="text"
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="visitors-table-container">
                <table className="visitors-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Check In/Out</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVisitors.map(visitor => (
                            <tr key={visitor.id}>
                                <td>{visitor.name}</td>
                                <td>
                                    <div>{visitor.phone}</div>
                                    <div className="email-small">{visitor.email}</div>
                                </td>
                                <td>{visitor.purpose}</td>
                                <td>
                                    <span className={`status status-${visitor.status}`}>
                                        {visitor.status}
                                    </span>
                                </td>
                                <td>
                                    {visitor.checkIn && (
                                        <div>In: {new Date(visitor.checkIn).toLocaleTimeString()}</div>
                                    )}
                                    {visitor.checkOut && (
                                        <div>Out: {new Date(visitor.checkOut).toLocaleTimeString()}</div>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteClick(visitor.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showDeleteConfirm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this visitor record?</p>
                        <div className="modal-actions">
                            <button onClick={confirmDelete} className="btn btn-danger">
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
