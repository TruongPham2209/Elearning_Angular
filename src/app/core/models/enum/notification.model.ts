export enum NotificationType {
    SYSTEM = 'SYSTEM',
    LECTURER_ONLY = 'LECTURER_ONLY',
    STUDENT_ONLY = 'STUDENT_ONLY',
}

export interface NotificationOption {
    scope: NotificationType;
    label: string;
    classes: string;
}

export const systemNotificationOption: NotificationOption = {
    scope: NotificationType.SYSTEM,
    label: 'Hệ thống',
    classes: 'bg-primary text-white',
};

export const lecturerNotificationOption: NotificationOption = {
    scope: NotificationType.LECTURER_ONLY,
    label: 'Giảng viên',
    classes: 'bg-success text-white',
};

export const studentNotificationOption: NotificationOption = {
    scope: NotificationType.STUDENT_ONLY,
    label: 'Người học',
    classes: 'bg-info text-white',
};

export class NotificationUtil {
    static getTypeLabel(type: NotificationType): string {
        switch (type) {
            case NotificationType.SYSTEM:
                return 'Hệ thống';
            case NotificationType.LECTURER_ONLY:
                return 'Giảng viên';
            case NotificationType.STUDENT_ONLY:
                return 'Người học';
            default:
                return 'Không xác định';
        }
    }

    static getDetailLabel(type: NotificationType): string {
        switch (type) {
            case NotificationType.SYSTEM:
                return 'Hệ thống - Dành cho tất cả người dùng';
            case NotificationType.LECTURER_ONLY:
                return 'Giảng viên- Chỉ hiện thị cho giảng viên';
            case NotificationType.STUDENT_ONLY:
                return 'Người học - Chỉ hiện thị cho người học';
            default:
                return 'Không xác định';
        }
    }

    static getTypeBadgeClass(type: NotificationType): string {
        switch (type) {
            case NotificationType.SYSTEM:
                return 'badge bg-primary';
            case NotificationType.LECTURER_ONLY:
                return 'badge bg-success';
            case NotificationType.STUDENT_ONLY:
                return 'badge bg-info';
            default:
                return 'badge bg-secondary';
        }
    }
}
