import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useVisitors } from '../context/VisitorContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { useVisitorOperations } from '../hooks/useVisitorOperations';
import { employees } from '../data/employees';

const NewVisitorForm = () => {
    const { addVisitor } = useVisitors();
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const { submitVisitor, loading, error } = useVisitorOperations();
    const [formData, setFormData] = useState({
        name: '',
        email: '', // optional
        phone: '',
        employeeId: '', // New field for employee ID
        purpose: '',
        photo: null // optional
    });
    const webcamRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Store complete form data in localStorage
            const existingData = JSON.parse(localStorage.getItem('visitorProfiles') || '[]');
            const visitorProfile = {
                ...formData,
                phone: formData.phone.trim(),
                lastUpdated: new Date().toISOString()
            };

            // Update or add new profile
            const profileIndex = existingData.findIndex(p => p.phone === visitorProfile.phone);
            if (profileIndex !== -1) {
                existingData[profileIndex] = visitorProfile;
            } else {
                existingData.push(visitorProfile);
            }

            localStorage.setItem('visitorProfiles', JSON.stringify(existingData));

            // Continue with normal submission
            await addVisitor({
                ...formData,
                id: Date.now(), // Ensure unique ID
                createdAt: new Date().toISOString(),
                status: 'pending'
            });

            // Show success message
            setShowSuccess(true);

            // Delay redirect to show success message
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            alert('Error submitting form: ' + error.message);
        }
    };

    if (showSuccess) {
        return (
            <div className="panel">
                <div className="success-message">
                    <svg className="success-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h2>Thank you for registering!</h2>
                    <p>Please be seated, Once approved we will notify you.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel">
            <h2 className="panel-title">New Visitor Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email (optional)"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="employeeId" className="form-label">Visiting Employee</label>
                    <select
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({
                            ...formData,
                            employeeId: Number(e.target.value)
                        })}
                        className="form-input"
                        required
                    >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.name} - {emp.department}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Purpose for Visit"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="form-input"
                        rows="3"
                        required
                    />
                </div>
                <div className="webcam-section">
                    <p className="text-sm text-gray-600 mb-2">Photo Capture (optional)</p>
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam-preview"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            const photo = webcamRef.current.getScreenshot();
                            setFormData({ ...formData, photo });
                        }}
                        className="btn btn-secondary mt-2"
                    >
                        Capture Photo
                    </button>
                    {formData.photo && (
                        <img
                            src={formData.photo}
                            alt="Captured"
                            className="capture-image"
                        />
                    )}
                </div>
                <button type="submit" className="btn btn-primary w-full">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default NewVisitorForm;
