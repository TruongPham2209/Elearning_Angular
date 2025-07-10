import { Routes } from '@angular/router';
import { loginGuard } from '../guards/login.guard';
import * as Layout from '../layouts';
import * as FormPage from '../pages/form';

export const formRoutes: Routes = [
    {
        path: '',
        component: Layout.Web,
        children: [
            { path: 'login', canActivate: [loginGuard], component: FormPage.Login, title: 'Login Redirect' },
            { path: 'login/callback', component: FormPage.LoginCallback, title: 'Handle callback' },
        ],
    },
];
