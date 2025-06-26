interface ClassForm {
    courseId: string;
    semesterId: string;
    lecturerId: string;
    name: string;
    room: string;

    shift: number;
    daysInWeek: number[];

    studentCodes: string[];
}

interface ClassResponse {
    id: string;
    name: string;
    room: string;
    schedule: string;

    lecturerId: string;
    lecturerName: string;
    lecturerEmail: string;
}

export type { ClassForm, ClassResponse };
