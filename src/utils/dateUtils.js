export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

export const isThisWeek = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return date >= weekAgo;
};

export const getLastSixMonths = () => {
    const months = [];
    const current = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = new Date(current.getFullYear(), current.getMonth() - i, 1);
        months.push(month.toLocaleString('default', { month: 'short' }));
    }
    return months;
};
