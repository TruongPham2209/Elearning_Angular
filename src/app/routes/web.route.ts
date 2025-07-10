import { Routes } from '@angular/router';
import { webGuard } from '../guards/web.guard';
import * as Layout from '../layouts/';
import * as WebPage from '../pages/web';
import { TestComponent } from '../shared/pages/test/test.component';

export const webRoutes: Routes = [
    {
        path: '',
        component: Layout.Web,
        canActivate: [webGuard],
        children: [
            { path: '', redirectTo: '/home', pathMatch: 'full' },
            { path: 'home', component: WebPage.Home, title: 'Home Page' },
            { path: 'assignments', component: WebPage.Assignment, title: 'Assignment' },
            { path: 'classes', component: WebPage.Class, title: 'Class' },
            { path: 'test', component: TestComponent, title: 'Test Page' },
        ],
    },
];
