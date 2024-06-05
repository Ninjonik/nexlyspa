const formatTimestampToDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
        return 'today';
    } else if (date.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
        return 'yesterday';
    } else if (date > weekAgo) {
        const diff = Math.round((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return `${diff} days ago`;
    } else {
        return date.toLocaleDateString('en', { month: 'short', day: 'numeric' }) + '.';
    }
};

export default formatTimestampToDate;