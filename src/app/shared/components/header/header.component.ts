import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { adminNavigationItems, NavigationItem } from '../../../core/models/types/navigator.interface';
import { AuthenticationService } from '../../../core/services/auth/authentication.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule, NgbModule, ReactiveFormsModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
    @Input() managerRole!: ManagerRole;
    @ViewChild('changePasswordModal') changePasswordModal!: TemplateRef<any>;

    navigationItems!: NavigationItem[];
    routeToHome: string = '/home';
    isCollapsed = true;

    // New properties for change password modal
    changePasswordForm!: FormGroup;
    showCurrentPassword: boolean = false;
    showNewPassword: boolean = false;
    showConfirmPassword: boolean = false;
    isChangingPassword: boolean = false;
    changePasswordError: string = '';
    changePasswordSuccess: string = '';
    private modalRef!: NgbModalRef;

    constructor(
        private readonly authService: AuthenticationService,
        private readonly modalService: NgbModal,
        private readonly fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.initializeNavigation();

        this.changePasswordForm = this.fb.group(
            {
                currentPassword: ['', [Validators.required]],
                newPassword: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', [Validators.required]],
            },
            { validators: this.passwordMatchValidator },
        );
    }

    private passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (newPassword !== confirmPassword) {
            form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        } else {
            const errors = form.get('confirmPassword')?.errors;
            if (errors?.['passwordMismatch']) {
                delete errors['passwordMismatch'];
                form.get('confirmPassword')?.setErrors(Object.keys(errors).length ? errors : null);
            }
        }
        return null;
    }

    private initializeNavigation(): void {
        if (this.managerRole === ManagerRole.ADMIN) {
            this.routeToHome = '/admin/dashboard';
            this.navigationItems = adminNavigationItems;
            return;
        }

        if (this.managerRole === ManagerRole.LECTURER) {
            this.routeToHome = '/lecturer/home';
            // Add lecturer navigation items if needed
            this.navigationItems = []; // Replace with lecturerNavigationItems
            return;
        }

        // Student or other roles
        this.navigationItems = [];
    }

    getUserDisplayName(): string {
        switch (this.managerRole) {
            case ManagerRole.ADMIN:
                return 'Admin';
            case ManagerRole.LECTURER:
                return 'Lecturer';
            case ManagerRole.STUDENT:
                return 'Student';
            default:
                return 'User';
        }
    }

    onProfileClick(event: Event): void {
        event.preventDefault();
        // Navigate to the profile page based on the manager role
    }

    onSignOutClick(): void {
        this.authService.logout();
    }

    // Update the onChangePasswordClick method
    onChangePasswordClick(): void {
        this.resetChangePasswordForm();
        this.modalRef = this.modalService.open(this.changePasswordModal, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
    }

    // Password visibility toggle methods
    toggleCurrentPasswordVisibility(): void {
        this.showCurrentPassword = !this.showCurrentPassword;
    }

    toggleNewPasswordVisibility(): void {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    // Submit change password form
    onSubmitChangePassword(): void {
        if (this.changePasswordForm.valid && !this.isChangingPassword) {
            this.isChangingPassword = true;
            this.changePasswordError = '';
            this.changePasswordSuccess = '';

            const formValue = this.changePasswordForm.value;

            // // Call your API service here
            // this.authService.changePassword(formValue.currentPassword, formValue.newPassword).subscribe({
            //     next: (response) => {
            //         this.isChangingPassword = false;
            //         this.changePasswordSuccess = 'Password changed successfully!';

            //         // Close modal after 2 seconds
            //         setTimeout(() => {
            //             this.modalRef.close();
            //         }, 2000);
            //     },
            //     error: (error) => {
            //         this.isChangingPassword = false;
            //         this.changePasswordError = error.message || 'Failed to change password. Please try again.';
            //     },
            // });
        }
    }

    // Reset form when opening modal
    private resetChangePasswordForm(): void {
        this.changePasswordForm.reset();
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.isChangingPassword = false;
        this.changePasswordError = '';
        this.changePasswordSuccess = '';
    }

    // Password strength checking methods
    getPasswordStrengthWidth(): number {
        const password = this.changePasswordForm.get('newPassword')?.value || '';
        let strength = 0;

        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;

        return strength;
    }

    getPasswordStrengthClass(): string {
        const strength = this.getPasswordStrengthWidth();
        if (strength <= 25) return 'bg-danger';
        if (strength <= 50) return 'bg-warning';
        if (strength <= 75) return 'bg-info';
        return 'bg-success';
    }

    getPasswordStrengthText(): string {
        const strength = this.getPasswordStrengthWidth();
        if (strength <= 25) return 'Weak';
        if (strength <= 50) return 'Fair';
        if (strength <= 75) return 'Good';
        return 'Strong';
    }

    // Password requirement checking methods
    hasMinLength(): boolean {
        const password = this.changePasswordForm.get('newPassword')?.value || '';
        return password.length >= 8;
    }

    hasUpperCase(): boolean {
        const password = this.changePasswordForm.get('newPassword')?.value || '';
        return /[A-Z]/.test(password);
    }

    hasLowerCase(): boolean {
        const password = this.changePasswordForm.get('newPassword')?.value || '';
        return /[a-z]/.test(password);
    }

    hasNumber(): boolean {
        const password = this.changePasswordForm.get('newPassword')?.value || '';
        return /[0-9]/.test(password);
    }
}
