interface NotificationRequest {
}

interface NotificationResponse {
    id: string;
    title: string;
    createdAt: Date;
    createdBy: string;
}

export type { NotificationRequest, NotificationResponse };