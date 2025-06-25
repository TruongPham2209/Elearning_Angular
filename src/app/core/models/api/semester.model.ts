interface SemesterRequest {
    name: string;
    startDate: Date;
    endDate: Date;
}

interface SemesterForm {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

interface SemesterResponse {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
}

export type { SemesterRequest, SemesterResponse, SemesterForm };
