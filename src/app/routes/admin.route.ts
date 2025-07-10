import { Routes } from '@angular/router';
import * as Layout from '../layouts/';
import * as AdminPage from '../pages/admin';
import { adminGuard } from '../guards/admin.guard';

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: Layout.Admin,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminPage.Dashboard, title: 'Dashboard' },
            { path: 'classes', component: AdminPage.Class, title: 'Manage Classes' },
            { path: 'classes/students', component: AdminPage.ManageStudent, title: 'Manage Students' },
            { path: 'courses', component: AdminPage.Course, title: 'Manage Courses' },
            { path: 'notifications', component: AdminPage.Notification, title: 'Manage Notifications' },
            { path: 'users', component: AdminPage.User, title: 'Manage Users' },
            { path: 'semesters', component: AdminPage.Semester, title: 'Manage Semesters' },
        ],
    },
];
