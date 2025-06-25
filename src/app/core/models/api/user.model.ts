interface UserRequest {
    id: string;
    username: string;
    fullName: string;
    email: string;
}

interface UserResponse {
    id: string;
    username?: string;
    fullName: string;
    email: string;
    role?: string;
}

interface UserChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export type { UserRequest, UserResponse, UserChangePasswordRequest };
