import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employees } from '../data/employees';

const EmployeeLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            const employee = employees.find(emp =>
                emp.username === formData.username.trim() &&
                emp.password === formData.password.trim()
            );

            if (!employee) {
                throw new Error('Invalid username or password');
            }

            // Store employee data
            localStorage.setItem('userType', `employee-${employee.id}`);
            localStorage.setItem('employeeData', JSON.stringify({
                id: employee.id,
                name: employee.name,
                department: employee.department,
                email: employee.email
            }));

            // Clear form and navigate
            setFormData({ username: '', password: '' });
            navigate('/employee');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="panel">
            <div className="auth-form">
                <h2 className="panel-title text-center">Employee Login</h2>
                {error && (
                    <div className="error-message">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={(e) => setFormData({
                                ...formData,
                                username: e.target.value
                            })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({
                                ...formData,
                                password: e.target.value
                            })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Login
                    </button>
                </form>

                <div className="demo-credentials mt-4">
                    <h3>Demo Credentials</h3>
                    <p><strong>Username:</strong> edavis</p>
                    <p><strong>Password:</strong> ed123456</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeLogin;
