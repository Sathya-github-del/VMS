import { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useVisitors } from '../context/VisitorContext';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboardStats = () => {
    const { visitors, getVisitorStats } = useVisitors();
    const stats = getVisitorStats();
    const chartRef = useRef(null);

    // Cleanup chart on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const chartData = {
        labels: ['Today', 'This Week', 'This Month'],
        datasets: [{
            label: 'Visitor Traffic',
            data: [
                visitors.filter(v => isToday(v.createdAt)).length,
                visitors.filter(v => isThisWeek(v.createdAt)).length,
                visitors.filter(v => isThisMonth(v.createdAt)).length
            ],
            backgroundColor: ['#3b82f6', '#10b981', '#6366f1']
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Visitor Traffic Analysis'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <div className="stats-section">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Visitors</h3>
                    <p className="stat-value">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Approval</h3>
                    <p className="stat-value pending">{stats.pending}</p>
                </div>
                <div className="stat-card">
                    <h3>Currently Checked In</h3>
                    <p className="stat-value success">{stats.checkedIn}</p>
                </div>
                <div className="stat-card">
                    <h3>Today's Visitors</h3>
                    <p className="stat-value">{stats.today}</p>
                </div>
            </div>
            <div className="chart-container" style={{ height: '300px', marginTop: '2rem' }}>
                <Bar
                    ref={chartRef}
                    data={chartData}
                    options={chartOptions}
                />
            </div>
        </div>
    );
};

const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return date >= weekAgo;
};

const isThisMonth = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

export default AdminDashboardStats;
