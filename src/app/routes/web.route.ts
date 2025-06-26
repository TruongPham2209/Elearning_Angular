import { Routes } from '@angular/router';
import * as Layout from '../layouts/';
import * as WebPage from '../pages/web';

export const webRoutes: Routes = [
    {
        path: '',
        component: Layout.Web,
        // canActivate: [],
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'home', component: WebPage.Home, title: 'Home Page' },
            { path: 'assignments', component: WebPage.Assignment, title: 'Assignment' },
            { path: 'classes', component: WebPage.Class, title: 'Class' },
        ],
    },
];
