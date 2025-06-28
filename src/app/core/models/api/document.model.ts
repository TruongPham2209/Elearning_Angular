interface DocumentRequest {
    lessionId: string;
    title: string;
    content: string;
}

interface DocumentResponse {
    id: string;
    title: string;
    content: string;
    uploadAt: Date;

    fileId: string;
    fileName: string;
}

export type { DocumentRequest, DocumentResponse };
