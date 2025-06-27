interface SubmissionRequest {
    assignmentId: string;
}

interface SubmissionResponse {
    id: string;
    fileName: string;
    fileId: string;
    assignmentId: string;
    uploadAt: Date;
}

export type { SubmissionRequest, SubmissionResponse };
