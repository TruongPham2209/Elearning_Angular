import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../core/services/auth/authentication.service';
import { ManagerRole } from '../core/models/enum/role.model';
import { ToastService } from '../core/services/ui/toast.service';

export const webGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const toastService = inject(ToastService);

    if (!authService.hasAnyRoles([ManagerRole.STUDENT])) {
        toastService.show('You do not have permission to access this page.', 'error');
        return inject(Router).createUrlTree(['/login']);
    }
    return true;
};
