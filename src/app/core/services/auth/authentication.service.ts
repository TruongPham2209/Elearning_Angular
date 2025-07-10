import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTHORIZATION_SERVER } from '../../../../environments/endpoint.env';
import { ManagerRole } from '../../models/enum/role.model';
import { ToastService } from '../ui/toast.service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private readonly toastService: ToastService) {}

    isAuthenticated(): boolean {
        const accessToken = this.getToken();
        if (!accessToken) return false;

        try {
            jwtDecode<any>(accessToken);
            return true;
        } catch (err) {
            console.error('Invalid token format or fake token detected:', err);
        }

        this.logout();
        return false;
    }

    hasAnyRoles(roles: ManagerRole[]): boolean {
        const accessToken = this.getToken();

        if (!accessToken) return false;

        try {
            const decoded = jwtDecode<any>(accessToken);
            const userRoles: string[] = decoded.authorities || decoded.roles || [];
            return userRoles.some((role) => roles.includes(role as ManagerRole));
        } catch (err) {
            console.error('Invalid token format or fake token detected:', err);
        }

        this.toastService.show('You do not have permission to access this page.', 'error');
        this.logout();
        return false;
    }

    getToken(): string {
        return sessionStorage.getItem('access_token') || '';
    }

    logout() {
        console.log('Logging out...');
        sessionStorage.removeItem('access_token');
        this.toastService.show('You have been logged out successfully.', 'success');
        window.location.href = `${AUTHORIZATION_SERVER}/logout`;
    }
}
