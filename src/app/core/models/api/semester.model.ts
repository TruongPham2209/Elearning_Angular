import { ClassResponse } from './class.model';

interface SemesterForm {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
}

interface SemesterResponse {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
}

interface SemesterWithClassesResponse {
    id: string;
    title: string;
    classes: ClassResponse[];
}

export type { SemesterResponse, SemesterForm, SemesterWithClassesResponse };
