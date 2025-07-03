interface SubmissionResponse {
    id: string;
    studentCode: string;
    fileName: string;
    fileId: string;
    assignmentId: string;
    uploadAt: Date;
    isSubmitted: boolean;
}

interface SubmissionFilter {
    assignmentId: string;
    page: number;
    pageSize: number;
}

interface SubmissionLogResponse {
    action: string;
    fileName?: string;
    performAt: Date;
}

export type { SubmissionResponse, SubmissionFilter, SubmissionLogResponse };
