import { Component } from '@angular/core';
import { config } from '../../../../environments/oauth2.env';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';

@Component({
    selector: 'app-login',
    imports: [],
    template: 'Đang xử lý đăng nhập ...',
})
export class LoginPage {
    constructor(
        private readonly router: Router,
        private readonly authService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        if (this.authService.getToken()) {
            this.router.navigate(['/home']);
            return;
        }

        const authorizationServerURL = config.authorizationEndpoint;
        const codeVerifier = this.generateCodeVerifier();
        sessionStorage.setItem('code_verifier', codeVerifier);
        const httpParams = new HttpParams({
            fromObject: {
                client_id: config.clientId,
                response_type: config.responseType,
                response_mode: 'form_data',
                scope: config.scope,
                nonce: this.generateNonce(),
                redirect_uri: config.redirectUri,
                code_challenge: this.generateCodeChallenge(codeVerifier),
                code_challenge_method: config.codeChallengeMethod,
            },
        });

        window.location.href = `${authorizationServerURL}?${httpParams.toString()}`;
    }

    private generateCodeChallenge(codeVerifier: string): string {
        const utf8Verifier = CryptoJS.enc.Utf8.parse(codeVerifier);
        const hash = CryptoJS.SHA256(utf8Verifier);

        return hash.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    }

    private generateNonce(): string {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map((b) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(b % 62))
            .join('');
    }

    private generateCodeVerifier(): string {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);

        return btoa(String.fromCharCode(...array))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
}
