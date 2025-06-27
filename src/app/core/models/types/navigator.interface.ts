import { BannedCause } from './../enum/banned_cause.model';
export interface NavigationItem {
    iconClass: string;
    redirectTo: string;
    name: string;
    title: string;
}

export interface BannedCauseOption {
    value: BannedCause;
    label: string;
}

export const adminNavigationItems: NavigationItem[] = [
    {
        iconClass: 'bi bi-house',
        redirectTo: '/admin/dashboard',
        name: 'Dashboard',
        title: 'Admin Dashboard',
    },
    {
        iconClass: 'bi bi-mortarboard',
        redirectTo: '/admin/semesters',
        name: 'Semesters',
        title: 'Manage Semesters',
    },
    {
        iconClass: 'bi bi-book',
        redirectTo: '/admin/courses',
        name: 'Courses',
        title: 'Manage Courses',
    },
    {
        iconClass: 'bi bi-bell',
        redirectTo: '/admin/notifications',
        name: 'Notifications',
        title: 'Manage Notifications',
    },
    {
        iconClass: 'bi bi-person',
        redirectTo: '/admin/users',
        name: 'Users',
        title: 'Manage Users',
    },
];

export const bannedCauseOptions: BannedCauseOption[] = [
    { value: BannedCause.CHEAT, label: 'Gian lận thi cử' },
    { value: BannedCause.RULE_VIOLATION, label: 'Vi phạm quy định' },
    { value: BannedCause.DISRUPTIVE_BEHAVIOR, label: 'Hành vi gây rối' },
    { value: BannedCause.ATTENDANCE_ISSUE, label: 'Vấn đề điểm danh' },
    { value: BannedCause.OTHER, label: 'Khác' },
];
