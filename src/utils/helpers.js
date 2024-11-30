export function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

export function countDaysBetweenStringAndString(dateString, dateString2) {
    const date1 = new Date(dateString);
    const date2 = new Date(dateString2);
    const timeDifference = date2.getTime() - date1.getTime();
    return Math.abs(timeDifference / (1000 * 3600 * 24));
}