interface AssignmentRequest {
    lessionId: string;
    title: string;
    content: string;
    deadline: Date;
}

interface AssignmentResponse {
    id: string;
    title: string;
    content: string;
    deadline: Date;
}

export type { AssignmentRequest, AssignmentResponse };
