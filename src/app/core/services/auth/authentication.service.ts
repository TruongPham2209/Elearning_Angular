import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AUTHORIZATION_SERVER } from '../../../../environments/endpoint.env';
import { ManagerRole } from '../../models/enum/role.model';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(private readonly router: Router) {}

    isAuthenticated(): boolean {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return false;

        try {
            jwtDecode<any>(accessToken);
            return true;
        } catch (err) {
            console.error('Invalid token format or fake token detected:', err);
            this.logout();
            return false;
        }
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
            this.logout();
        }

        return false;
    }

    getToken(): string {
        return localStorage.getItem('access_token') || '';
    }

    logout() {
        localStorage.removeItem('access_token');
        // this.router.navigate(['/login']);
        window.location.href = `${AUTHORIZATION_SERVER}/logout`;
    }
}
