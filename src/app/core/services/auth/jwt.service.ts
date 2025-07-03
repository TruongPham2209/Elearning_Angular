import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { config } from '../../../../environments/oauth2.env';
import { JwtResponse } from '../../models/api/jwt.model';
import { jwtDecode } from 'jwt-decode';
import { ManagerRole } from '../../models/enum/role.model';

@Injectable({
    providedIn: 'root',
})
export class JwtService {
    constructor(
        private readonly http: HttpClient,
        private readonly router: Router,
    ) {}

    exchangeCodeForToken(code: string): Observable<JwtResponse> {
        const codeVerifier = sessionStorage.getItem('code_verifier');
        if (!codeVerifier) {
            this.router.navigate(['/login']);
            return throwError(() => new Error('Missing code_verifier'));
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(`${config.clientId}:${config.clientSecret}`),
        };

        const body = new URLSearchParams();
        body.set('client_id', config.clientId);
        body.set('code', code);
        body.set('redirect_uri', config.redirectUri);
        body.set('code_verifier', codeVerifier);
        body.set('grant_type', 'authorization_code');
        body.set('scope', config.scope);

        return this.http.post<JwtResponse>(config.tokenEndpoint, body.toString(), { headers }).pipe(
            tap((jwt) => {
                this.setTokens(jwt);
                this.redirectToHome(jwt.access_token);
            }),
            catchError((error) => {
                return throwError(() => error);
            }),
        );
    }

    private setTokens(jwt: JwtResponse): void {
        localStorage.setItem('access_token', jwt.access_token);
    }

    private redirectToHome(accessToken: string): void {
        const decoded = jwtDecode<any>(accessToken);
        const userRoles: string[] = decoded.authorities || decoded.roles || [];
        if (userRoles.includes(ManagerRole.ADMIN)) {
            this.router.navigate(['/admin/dashboard']);
        } else if (userRoles.includes(ManagerRole.LECTURER)) {
            this.router.navigate(['/lecturer/home']);
        } else {
            this.router.navigate(['/home']);
        }
    }
}
