import { Routes } from '@angular/router';
import { adminRoutes } from './routes/admin.route';
import { formRoutes } from './routes/form.route';
import { lecturerRoutes } from './routes/lecturer.route';
import { webRoutes } from './routes/web.route';

export const routes: Routes = [
    ...adminRoutes,
    ...formRoutes,
    ...lecturerRoutes,
    ...webRoutes,
    // { path: 'logout', component: FormPage.Logout },
    // {
    //     path: '**', redirectTo: 'error?status=404', pathMatch: 'full'
    // }
];
