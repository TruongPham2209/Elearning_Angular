interface CourseRequest {
    name: string;
    totalLessions: number; // in hours
    teacherId: string;
}

interface CourseForm {
    id: string;
    name: string;
    totalLessions: number;
    teacherId: string;
    semesterId: string;
}

interface CourseResponse {
    id: string;
    semesterId: string;
    title: string;
    totalLessions: number; // in hours
    teacherId: string;
    teacherName: string;
}

export type { CourseRequest, CourseResponse, CourseForm };
