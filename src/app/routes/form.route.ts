import { Routes } from '@angular/router';
import * as Layout from '../layouts';
import * as FormPage from '../pages/form';

export const formRoutes: Routes = [
    {
        path: '',
        component: Layout.Web,
        // canActivate: [managerGuard],
        children: [
            { path: 'login', component: FormPage.Login, title: 'Login Redirect' },
            { path: 'login/callback', component: FormPage.LoginCallback, title: 'Handle callback' },
        ],
    },
];
