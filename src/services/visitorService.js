import { v4 as uuidv4 } from 'uuid';

class VisitorService {
    constructor() {
        this.visitors = JSON.parse(localStorage.getItem('visitors')) || [];
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    }

    // Save data to localStorage
    _saveData() {
        localStorage.setItem('visitors', JSON.stringify(this.visitors));
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Create new visitor or update existing
    createVisitor(visitorData) {
        const existingVisitor = this.visitors.find(v => v.phone === visitorData.phone);
        let newVisitor;

        if (existingVisitor) {
            newVisitor = {
                ...existingVisitor,
                purpose: visitorData.purpose,
                visitingMember: visitorData.visitingMember,
                status: 'pending',
                checkIn: null,
                checkOut: null,
                lastVisit: existingVisitor.createdAt,
                visitCount: existingVisitor.visitCount + 1,
                createdAt: new Date().toISOString()
            };
            this.visitors = this.visitors.map(v =>
                v.id === existingVisitor.id ? newVisitor : v
            );
        } else {
            newVisitor = {
                ...visitorData,
                id: uuidv4(),
                status: 'pending',
                createdAt: new Date().toISOString(),
                checkIn: null,
                checkOut: null,
                lastVisit: null,
                visitCount: 1
            };
            this.visitors.push(newVisitor);
        }

        this._saveData();
        this.createNotification('employee', newVisitor);
        return newVisitor;
    }

    // Update visitor status
    updateVisitorStatus(id, status) {
        const visitor = this.visitors.find(v => v.id === id);
        if (visitor) {
            visitor.status = status;
            this._saveData();
            this.createNotification(
                status === 'approved' ? 'guard' : 'visitor',
                visitor
            );
            return visitor;
        }
        return null;
    }

    // Check in visitor
    checkInVisitor(id) {
        const visitor = this.visitors.find(v => v.id === id);
        if (visitor && visitor.status === 'approved') {
            visitor.checkIn = new Date().toISOString();
            this._saveData();
            return visitor;
        }
        return null;
    }

    // Check out visitor
    checkOutVisitor(id) {
        const visitor = this.visitors.find(v => v.id === id);
        if (visitor && visitor.checkIn) {
            visitor.checkOut = new Date().toISOString();
            this._saveData();
            return visitor;
        }
        return null;
    }

    // Create notification
    createNotification(type, visitor) {
        const notification = {
            id: uuidv4(),
            type,
            visitor,
            read: false,
            createdAt: new Date().toISOString()
        };
        this.notifications.unshift(notification);
        this._saveData();
        return notification;
    }

    // Get visitor stats
    getStats() {
        return {
            total: this.visitors.length,
            pending: this.visitors.filter(v => v.status === 'pending').length,
            approved: this.visitors.filter(v => v.status === 'approved').length,
            rejected: this.visitors.filter(v => v.status === 'rejected').length,
            checkedIn: this.visitors.filter(v => v.checkIn && !v.checkOut).length
        };
    }
}

export const visitorService = new VisitorService();
