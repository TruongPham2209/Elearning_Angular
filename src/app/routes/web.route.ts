import { Routes } from "@angular/router";

export const webRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: 'home',
    //     pathMatch: 'full'
    // },

    // {
    //     path: 'manage',
    //     component: Layout.Manager,
    //     canActivate: [managerGuard],
    //     children: [
    //         { path: 'home', component: ManagerPage.Home, title: "Home Page" },
    //         { path: 'chart', component: ManagerPage.Chart, title: "Statistic", canActivate: [onlyManagerGuard] },
    //         { path: 'room', component: ManagerPage.Room, title: "Manage Room", canActivate: [onlyManagerGuard] },
    //         { path: 'discount', component: ManagerPage.Discount, title: "Manage Discount", canActivate: [onlyManagerGuard] },
    //         { path: 'booking', component: ManagerPage.Booking, title: "Manage Booking" },
    //         { path: 'payment', component: ManagerPage.Payment, title: "Manage Payment" },
    //         { path: 'agency', component: ManagerPage.Agency, title: "Manage Agency", canActivate: [onlyManagerGuard] },
    //     ]
    // },

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
