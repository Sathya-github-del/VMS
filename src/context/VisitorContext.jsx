import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { employees } from '../data/employees';

// Create the context with a default value
const VisitorContext = createContext({
    visitors: [],
    notifications: [],
    addVisitor: () => { },
    updateVisitorStatus: () => { },
    checkInVisitor: () => { },
    checkOutVisitor: () => { },
    deleteVisitor: () => { },
    markNotificationRead: () => { },
    getVisitorStats: () => ({}),
    findVisitorByPhone: () => null
});

export const VisitorProvider = ({ children }) => {
    const [state, setState] = useState({
        visitors: JSON.parse(localStorage.getItem('visitors') || '[]'),
        notifications: JSON.parse(localStorage.getItem('notifications') || '[]')
    });

    // Persist data to localStorage
    useEffect(() => {
        localStorage.setItem('visitors', JSON.stringify(state.visitors));
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
    }, [state]);

    const addVisitor = (visitorData) => {
        const selectedEmployee = employees.find(emp => emp.id === parseInt(visitorData.employeeId));
        if (!selectedEmployee) {
            throw new Error('Selected employee not found');
        }

        const newVisitor = {
            ...visitorData,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            checkIn: null,
            checkOut: null,
            visitCount: 1,
            lastVisit: null,
            employeeName: selectedEmployee.name,
            employeeId: selectedEmployee.id // Ensure employeeId is stored
        };

        setState(prev => ({
            ...prev,
            visitors: [...prev.visitors, newVisitor],
            notifications: [
                {
                    id: uuidv4(),
                    type: 'employee',
                    employeeId: selectedEmployee.id, // Use the selected employee's ID
                    visitor: newVisitor,
                    read: false,
                    createdAt: new Date().toISOString()
                },
                ...prev.notifications
            ]
        }));

        return newVisitor;
    };

    const updateVisitorStatus = (id, status) => {
        setState(prev => {
            const updatedVisitors = prev.visitors.map(visitor =>
                visitor.id === id ? { ...visitor, status } : visitor
            );

            const visitor = updatedVisitors.find(v => v.id === id);
            const notificationType = status === 'approved' ? 'guard' : 'visitor';

            return {
                visitors: updatedVisitors,
                notifications: [
                    {
                        id: uuidv4(),
                        type: notificationType,
                        visitor: { ...visitor, status },
                        read: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev.notifications
                ]
            };
        });
    };

    const checkInVisitor = (id) => {
        setState(prev => ({
            ...prev,
            visitors: prev.visitors.map(visitor =>
                visitor.id === id
                    ? {
                        ...visitor,
                        checkIn: new Date().toISOString(),
                        lastVisit: visitor.createdAt,
                        visitCount: visitor.visitCount + 1
                    }
                    : visitor
            )
        }));
    };

    const checkOutVisitor = (id) => {
        setState(prev => ({
            ...prev,
            visitors: prev.visitors.map(visitor =>
                visitor.id === id
                    ? { ...visitor, checkOut: new Date().toISOString() }
                    : visitor
            )
        }));
    };

    const deleteVisitor = (id) => {
        setState(prev => ({
            ...prev,
            visitors: prev.visitors.filter(v => v.id !== id),
            notifications: prev.notifications.filter(n => n.visitor.id !== id)
        }));
    };

    const markNotificationRead = (id) => {
        setState(prev => ({
            ...prev,
            notifications: prev.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        }));
    };

    const getVisitorStats = () => {
        const today = new Date().toDateString();
        return {
            total: state.visitors.length,
            pending: state.visitors.filter(v => v.status === 'pending').length,
            approved: state.visitors.filter(v => v.status === 'approved').length,
            rejected: state.visitors.filter(v => v.status === 'rejected').length,
            checkedIn: state.visitors.filter(v => v.checkIn && !v.checkOut).length,
            today: state.visitors.filter(v =>
                new Date(v.createdAt).toDateString() === today
            ).length
        };
    };

    const findVisitorByPhone = (phone) => {
        return state.visitors.find(visitor => visitor.phone === phone);
    };

    const contextValue = {
        visitors: state.visitors,
        notifications: state.notifications,
        addVisitor,
        updateVisitorStatus,
        checkInVisitor,
        checkOutVisitor,
        deleteVisitor,
        markNotificationRead,
        getVisitorStats,
        findVisitorByPhone
    };

    return (
        <VisitorContext.Provider value={contextValue}>
            {children}
        </VisitorContext.Provider>
    );
};

// Export the hook with error handling
export const useVisitors = () => {
    const context = useContext(VisitorContext);
    if (context === undefined) {
        throw new Error('useVisitors must be used within a VisitorProvider');
    }
    return context;
};
