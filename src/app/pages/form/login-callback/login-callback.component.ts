import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../../core/services/auth/jwt.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';

@Component({
    selector: 'app-login-callback',
    imports: [],
    template: 'Đang xử lý đăng nhập với code = {{code}}...',
})
export class LoginCallbackPage implements OnInit {
    code!: string;

    constructor(
        private readonly router: Router,
        private readonly jwtService: JwtService,
        private readonly authService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        const urlParams = new URLSearchParams(window.location.search);
        this.code = urlParams.get('code') || '';
        console.log('code', this.code);

        if (this.authService.getToken()) {
            this.router.navigate(['/home']);
            return;
        }

        if (!this.code) {
            this.router.navigate(['/login']);
            return;
        }

        this.jwtService.exchangeCodeForToken(this.code).subscribe();
    }
}
