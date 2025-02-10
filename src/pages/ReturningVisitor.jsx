import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVisitors } from '../context/VisitorContext';
import { employees } from '../data/employees';

const ReturningVisitor = () => {
    const { addVisitor } = useVisitors();
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [visitorProfile, setVisitorProfile] = useState(null);
    const [previousVisit, setPreviousVisit] = useState(null);
    const [formData, setFormData] = useState({
        purpose: '',
        employeeId: '',
    });

    const handlePhoneSearch = () => {
        setError('');
        const normalizedPhone = phone.trim();

        try {
            // Check localStorage for visitor profile and previous visits
            const profiles = JSON.parse(localStorage.getItem('visitorProfiles') || '[]');
            const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');

            const existingProfile = profiles.find(p => p.phone === normalizedPhone);
            const lastVisit = visitors
                .filter(v => v.phone === normalizedPhone)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

            if (existingProfile) {
                setVisitorProfile(existingProfile);
                setPreviousVisit(lastVisit);
                setFormData(prev => ({
                    ...prev,
                    ...existingProfile,
                    employeeId: lastVisit?.employeeId || '',
                    purpose: lastVisit?.purpose || ''
                }));
            } else {
                setError('No previous records found. Please register as a new visitor.');
                setTimeout(() => navigate('/new-visitor'), 2000);
            }
        } catch (err) {
            setError('Error fetching visitor data');
        }
    };

    const handleContinueLastVisit = () => {
        if (!previousVisit) return;

        const newVisit = {
            ...previousVisit,
            status: 'pending',
            checkIn: null,
            checkOut: null,
            createdAt: new Date().toISOString(),
            id: undefined // Remove old ID to create new entry
        };

        addVisitor(newVisit);
        alert('Your visit request has been submitted with previous details.');
        navigate('/');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!visitorProfile) return;

        try {
            const newVisit = {
                ...visitorProfile,
                ...formData,
                status: 'pending',
                checkIn: null,
                checkOut: null,
                createdAt: new Date().toISOString()
            };

            addVisitor(newVisit);
            alert('Your visit request has been submitted.');
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="panel">
            <h2 className="panel-title">Returning Visitor</h2>
            {error && <div className="error-message">{error}</div>}

            {!visitorProfile ? (
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                    />
                    <button
                        onClick={handlePhoneSearch}
                        className="btn btn-primary mt-2 w-full"
                    >
                        Search
                    </button>
                </div>
            ) : (
                <>
                    <div className="visitor-card mb-4">
                        <div className="visitor-info">
                            <h3>{visitorProfile.name}</h3>
                            <p>Phone: {visitorProfile.phone}</p>
                            <p>Email: {visitorProfile.email || 'N/A'}</p>
                            {previousVisit && (
                                <div className="previous-visit-info mt-2">
                                    <h4>Last Visit Details:</h4>
                                    <p>Purpose: {previousVisit.purpose}</p>
                                    <p>Visited: {employees.find(e => e.id === previousVisit.employeeId)?.name}</p>
                                    <button
                                        onClick={handleContinueLastVisit}
                                        className="btn btn-secondary w-full mt-2"
                                    >
                                        Continue with Previous Visit Details
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="mb-4">Or Enter New Visit Details:</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <select
                                value={formData.employeeId}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    employeeId: Number(e.target.value)
                                })}
                                className="form-input"
                                required
                            >
                                <option value="">Select Employee to Visit</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} - {emp.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <textarea
                                placeholder="Purpose of Visit"
                                value={formData.purpose}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    purpose: e.target.value
                                })}
                                className="form-input"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full">
                            Submit New Visit
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default ReturningVisitor;
