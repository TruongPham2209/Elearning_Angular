import { ManagerRole } from './../enum/role.model';
interface UserRequest {
    role: 'LECTURER' | 'STUDENT';
    username: string;
    fullname: string;
    email: string;
}

interface UserResponse {
    id: string;
    username: string;
    fullname: string;
    email: string;
    role: ManagerRole;
}

interface UserChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

interface UserFilter {
    search: string;
    page: number;
    pageSize: number;
    role: ManagerRole | null;
}

export type { UserChangePasswordRequest, UserFilter, UserRequest, UserResponse };
