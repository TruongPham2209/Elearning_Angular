import { BannedCause } from '../enum/banned_cause.model';

interface StudentResponse {
    id: string;
    code: string; // MSSV
    fullname: string;
    email: string;
    banned: boolean;
    isSelected?: boolean; // Cho việc select để ban
}

interface BanStudentRequest {
    classId: string;
    studentCodes: string[];
    cause: BannedCause;
    description: string;
}

interface BannedStudentResponse {
    code: string;
    fullname: string;
    mail: string;
    cause: BannedCause;
    description: string;
    bannedBy: string;
    bannedDate: Date;
}

export type { StudentResponse, BanStudentRequest, BannedStudentResponse };
