import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../core/services/auth/authentication.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    authService.logout();

    return true;
};
