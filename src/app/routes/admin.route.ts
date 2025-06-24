import { Routes } from '@angular/router';
import * as Layout from '../layouts/';
import * as AdminPage from '../pages/admin';

export const adminRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    // },

    {
        path: 'admin',
        component: Layout.Admin,
        // canActivate: [],
        children: [
            { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminPage.Dashboard, title: 'Dashboard' },
            { path: 'classes', component: AdminPage.Class, title: 'Manage Classes' },
            { path: 'courses', component: AdminPage.Course, title: 'Manage Courses' },
            { path: 'notifications', component: AdminPage.Notification, title: 'Manage Notifications' },
            { path: 'users', component: AdminPage.User, title: 'Manage Users' },
            { path: 'semesters', component: AdminPage.Semester, title: 'Manage Semesters' },
        ],
    },

    // {
    //     path: 'manage/edit',
    //     component: Layout.Edit,
    //     canActivate: [managerGuard],
    //     children: [
    //         { path: 'room', component: EditPage.Room, title: "Edit Room", canActivate: [onlyManagerGuard] },
    //         { path: 'discount', component: EditPage.Discount, title: "Edit Booking", canActivate: [onlyManagerGuard] },
    //         { path: 'agency', component: EditPage.Agency, title: "Edit Agency", canActivate: [onlyManagerGuard] },
    //         { path: 'booking', component: EditPage.Booking, title: "Create Booking" },
    //     ]
    // },

    // {
    //     path: 'verify',
    //     canActivate: [verifyGuard],
    //     children: [
    //         { path: '', component: VerifyPage.Input, title: "Verify" },
    //         { path: 'otp', component: VerifyPage.Otp, title: "OTP" },
    //         { path: 'register', component: VerifyPage.Register, title: "Register" },
    //         { path: 'regret-password', component: VerifyPage.RegretPassword, title: "Regret Password" },
    //     ]
    // },

    // {
    //     path: '',
    //     canActivate: [loginGuard],
    //     children: [
    //         { path: 'login', component: FormPage.Login, title: "Login" },
    //         { path: 'login/code/google', component: WebPage.LoginCode, title: "Login Callback" },
    //     ]
    // },

    // { path: 'logout', component: FormPage.Logout },

    // {
    //     path: '',
    //     canActivate: [webGuard],
    //     children: [
    //         { path: 'error', component: WebPage.Error, title: "Error" },
    //     ]
    // },

    // {
    //     path: '',
    //     component: Layout.Web,
    //     canActivate: [webGuard],
    //     children: [
    //         { path: 'home', component: WebPage.Home, title: "Home" },
    //         { path: 'room', component: WebPage.Room, title: "List Rooms" },
    //         { path: 'booking', component: WebPage.RoomDetails, title: "Booking", canActivate: [onlyCustomerGuard] },
    //         { path: 'travel-profile', component: WebPage.TravelProfile, title: "Travel Profile", canActivate: [onlyCustomerGuard] },
    //         { path: 'profile', component: WebPage.Profile, title: "Profile" },
    //         { path: '', redirectTo: 'home', pathMatch: 'full' }
    //     ]
    // },
];
