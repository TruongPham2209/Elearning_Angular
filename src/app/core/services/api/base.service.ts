import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';
import { GATEWAY } from './../../../../environments/endpoint.env';

@Injectable({
    providedIn: 'root',
})
export class BaseFetchingService {
    private readonly GATEWAY = GATEWAY;
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthenticationService,
    ) {}

    private getHeaders(isFormData = false, addAuthorizationHeaders = true): HttpHeaders {
        let headers = new HttpHeaders();

        if (addAuthorizationHeaders) {
            const token = this.authService.getToken();
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        if (!isFormData) {
            headers = headers.set('Content-Type', 'application/json');
        }

        return headers;
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error(
            `Error Status: ${error.status}\nMessage: ${error.message}\nStack: ${error.error?.stack || 'No stack trace available'}`,
        );

        let errorMessage = 'An unexpected error occurred.';

        switch (error.status) {
            case 400:
                errorMessage = 'Bad Request: The server could not understand the request due to invalid syntax.';
                break;
            case 401:
                errorMessage = 'Unauthorized: Access is denied due to invalid credentials.';
                break;
            case 403:
                errorMessage = 'Forbidden: You do not have permission to access the requested resource.';
                break;
            case 404:
                errorMessage = 'Not Found: The requested resource could not be found on the server.';
                break;
            case 500:
                errorMessage =
                    'Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.';
                break;
            case 502:
                errorMessage = 'Bad Gateway: The server received an invalid response from the upstream server.';
                break;
            case 503:
                errorMessage =
                    'Service Unavailable: The server is currently unable to handle the request due to temporary overload or maintenance.';
                break;
            case 504:
                errorMessage =
                    'Gateway Timeout: The server did not receive a timely response from the upstream server.';
                break;
        }

        return throwError(() => ({
            status: error.status,
            message: errorMessage,
            raw: error,
        }));
    }

    private getUrl(url: string): string {
        if (url.startsWith('http')) {
            return url;
        } else if (url.startsWith('/')) {
            return `${this.GATEWAY}${url}`;
        } else {
            return `${this.GATEWAY}/${url}`;
        }
    }

    private buildParams(params?: Record<string, any>): HttpParams {
        let httpParams = new HttpParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        httpParams = httpParams.append(key, v);
                    });
                } else if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, value);
                }
            });
        }

        return httpParams;
    }

    public get<T>(url: string, params?: Record<string, any>, addAuthorizationHeaders = true): Observable<T> {
        return this.http
            .get<T>(this.getUrl(url), {
                headers: this.getHeaders(false, addAuthorizationHeaders),
                params: this.buildParams(params),
            })
            .pipe(catchError(this.handleError.bind(this)));
    }

    public post<T>(url: string, body: any, isFormData = false, addAuthorizationHeaders = true): Observable<T> {
        return this.http
            .post<T>(this.getUrl(url), body, {
                headers: this.getHeaders(isFormData, addAuthorizationHeaders),
            })
            .pipe(catchError(this.handleError.bind(this)));
    }

    public put<T>(url: string, body: any, isFormData = false, addAuthorizationHeaders = true): Observable<T> {
        return this.http
            .put<T>(this.getUrl(url), body, {
                headers: this.getHeaders(isFormData, addAuthorizationHeaders),
            })
            .pipe(catchError(this.handleError.bind(this)));
    }

    public delete<T>(url: string, params?: Record<string, any>, addAuthorizationHeaders = true): Observable<T> {
        return this.http
            .delete<T>(this.getUrl(url), {
                headers: this.getHeaders(false, addAuthorizationHeaders),
                params: this.buildParams(params),
            })
            .pipe(catchError(this.handleError.bind(this)));
    }
}
