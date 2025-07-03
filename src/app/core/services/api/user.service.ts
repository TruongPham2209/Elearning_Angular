import { Injectable } from '@angular/core';
import { BaseFetchingService } from './base.service';
import { Observable } from 'rxjs';
import { UserChangePasswordRequest, UserFilter, UserRequest, UserResponse } from '../../models/api/user.model';
import { Page } from '../../models/types/page.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getProfile(): Observable<UserResponse> {
        return this.fetchingService.get('/api/accounts/me');
    }

    changePassword(req: UserChangePasswordRequest): Observable<void> {
        return this.fetchingService.post('/api/accounts/change-password', req);
    }

    createBatchingUsers(users: UserRequest[]): Observable<void> {
        return this.fetchingService.post('/api/users/', users);
    }

    getAll(filter: UserFilter): Observable<Page<UserResponse>> {
        return this.fetchingService.post<Page<UserResponse>>(`/api/users/filter`, filter);
    }
}
