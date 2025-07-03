export function dateToInputString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getTodayString(): string {
    return dateToInputString(new Date());
}

export function validateDates(startDate: Date, endDate: Date, isUpdate: boolean = false): string | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    // Check if start date is valid
    if (startDate < today && !isUpdate) {
        return 'Start date must be today or a future date.';
    }

    // Check if end date is valid
    if (endDate < startDate) {
        return 'End date must be a valid date and not before the start date.';
    }

    return null; // Dates are valid
}
