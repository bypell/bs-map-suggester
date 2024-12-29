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

export function getDifficultyStyle(difficulty) {
    switch (difficulty) {
        case 1:
            return 'text-difficulty-easy';
        case 3:
            return 'text-difficulty-normal';
        case 5:
            return 'text-difficulty-hard';
        case 7:
            return 'text-difficulty-expert';
        case 9:
            return 'text-difficulty-expert-plus';
        default:
            return 'text-difficulty-normal';
    }
}

export function getDifficultyLabel(difficulty) {
    switch (difficulty) {
        case 1:
            return 'Easy';
        case 3:
            return 'Normal';
        case 5:
            return 'Hard';
        case 7:
            return 'Expert';
        case 9:
            return 'Expert+';
    }
}