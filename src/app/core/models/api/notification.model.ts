import { NotificationType } from '../enum/notification.model';

interface NotificationRequest {
    title: string;
    content: string;
    receiverScope: NotificationType;
}

interface NotificationResponse {
    id: string;
    title: string;
    createdAt: Date;
    sender: string;
    content: string;
    receiverScope: NotificationType;
}

interface NotificationFilter {
    scope: NotificationType;
    page: number;
    size: number;
}

export type { NotificationRequest, NotificationResponse, NotificationFilter };
