interface CourseForm {
    id: string;
    name: string;
    shortDescription: string;
    sessions: number;
}

interface CourseResponse {
    id: string;
    name: string;
    shortDescription: string;
    sessions: number;
}

interface CourseFilter {
    name: string;
    page: number;
    pageSize: number;
}

export type { CourseResponse, CourseForm, CourseFilter };
