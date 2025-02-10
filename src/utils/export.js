export const exportToCSV = (data, filename) => {
    // Convert object array to CSV string
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header =>
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ];
    const csvString = csvRows.join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const generateVisitorReport = (visitors, dateRange = 'all') => {
    let filteredVisitors = [...visitors];

    // Apply date filter
    switch (dateRange) {
        case 'today':
            filteredVisitors = visitors.filter(v => isToday(v.createdAt));
            break;
        case 'week':
            filteredVisitors = visitors.filter(v => isThisWeek(v.createdAt));
            break;
        case 'month':
            filteredVisitors = visitors.filter(v => isThisMonth(v.createdAt));
            break;
    }

    // Format data for export
    const reportData = filteredVisitors.map(v => ({
        Name: v.name,
        Email: v.email || 'N/A',
        Phone: v.phone,
        Purpose: v.purpose,
        VisitingMember: v.visitingMember,
        Status: v.status,
        CheckIn: v.checkIn ? formatDateTime(v.checkIn) : 'N/A',
        CheckOut: v.checkOut ? formatDateTime(v.checkOut) : 'N/A',
        VisitDate: formatDate(v.createdAt)
    }));

    const filename = `visitor-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(reportData, filename);
};
