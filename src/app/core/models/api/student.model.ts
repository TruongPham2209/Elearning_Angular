import { BannedCause } from '../enum/banned_cause.model';

interface StudentResponse {
    id: string;
    username: string; // MSSV
    fullname: string;
    email: string;
    isBanned: boolean;
    isSelected?: boolean; // Cho việc select để ban
}

interface BanStudentRequest {
    classId: string;
    students: string[];
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
