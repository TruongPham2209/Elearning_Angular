import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem, adminNavigationItems } from '../../../core/models/types/navigator.interface';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { UserService } from '../../../core/services/api/user.service';
import { UserResponse } from '../../../core/models/api/user.model';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'admin-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-sidebar.component.html',
    styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent implements OnInit {
    @Output() toggle = new EventEmitter<boolean>();
    userInfo!: UserResponse;

    isLoggedIn: boolean = true;
    isCollapsed = false;
    navigationItems: NavigationItem[] = adminNavigationItems;

    constructor(
        private readonly authService: AuthenticationService,
        private readonly userService: UserService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isAuthenticated();

        if (this.isLoggedIn) {
            this.userService.getProfile().subscribe({
                next: (user) => {
                    this.userInfo = user;
                },
                error: (err) => {
                    console.error('Failed to fetch user profile:', err);
                    this.toastService.show('Lỗi khi load thông tin user. ', 'error');
                },
            });
        }
    }

    toggleSidebar() {
        console.log('Sidebar toggled:', this.isCollapsed);
        this.isCollapsed = !this.isCollapsed;
        this.toggle.emit(this.isCollapsed);
    }
}
