export const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString();
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

export const isThisMonth = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const getTimeElapsed = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return formatDate(dateString);
};
