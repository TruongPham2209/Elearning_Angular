interface AnnouncementRequest {
    classId: string;
    title: string;
    content: string;
}

interface AnnouncementResponse {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

export type { AnnouncementRequest, AnnouncementResponse };
