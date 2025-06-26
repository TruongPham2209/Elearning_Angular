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

export type { CourseResponse, CourseForm };
