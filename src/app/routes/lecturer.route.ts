import { Routes } from '@angular/router';
import * as Layout from '../layouts/';
import * as LecturerPage from '../pages/lecturer';
import { lecturerGuard } from '../guards/lecturer.guard';

export const lecturerRoutes: Routes = [
    {
        path: 'lecturer',
        component: Layout.Lecturer,
        canActivate: [lecturerGuard],
        children: [
            { path: '', redirectTo: '/lecturer/home', pathMatch: 'full' },
            { path: 'home', component: LecturerPage.Home, title: 'Home Page' },
            { path: 'classes', component: LecturerPage.Class, title: 'Manage Classes' },
            { path: 'classes/students', component: LecturerPage.ManageStudent, title: 'Manage Students' },
            { path: 'submissions', component: LecturerPage.Submission, title: 'Submissions' },
        ],
    },
];
