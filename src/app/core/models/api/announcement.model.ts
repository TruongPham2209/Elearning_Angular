interface AnnouncementRequest {
    classId: string;
    title: string;
    content: string;
}

interface AnnouncementFilter {
    classId: string;
    page: number;
    pageSize: number;
}

interface AnnouncementResponse {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

export type { AnnouncementRequest, AnnouncementResponse, AnnouncementFilter };
