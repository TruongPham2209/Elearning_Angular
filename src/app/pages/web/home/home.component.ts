import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationFilter, NotificationResponse } from '../../../core/models/api/notification.model';
import { SemesterWithClassesResponse } from '../../../core/models/api/semester.model';
import { Page } from '../../../core/models/types/page.interface';
import { NotificationType } from '../../../core/models/enum/notification.model';
import { NotificationService } from '../../../core/services/api/notification.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ClassService } from '../../../core/services/api/class.service';

@Component({
    selector: 'web-home-page',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class WebHomePage implements OnInit {
    semesters: SemesterWithClassesResponse[] = [];

    // Notification data
    notifications: Page<NotificationResponse> = {
        contents: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    notificationFilter: NotificationFilter = {
        scope: NotificationType.SYSTEM,
        page: 0,
        pageSize: 10,
    };

    activeNotificationTab: NotificationType.SYSTEM | NotificationType.STUDENT_ONLY = NotificationType.SYSTEM;
    NotificationType = NotificationType;

    // Loading states
    loadingClass = false;
    loadingNotifications = false;

    // Selected notification for modal
    selectedNotification: NotificationResponse | null = null;

    constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly toastService: ToastService,
        private readonly classService: ClassService,
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        await Promise.all([this.loadClasses(), this.loadNotifications()]);
    }

    private async loadClasses(): Promise<void> {
        if (this.loadingClass) {
            return;
        }

        this.loadingClass = true;
        this.classService.getClasses().subscribe({
            next: (semesters) => {
                this.semesters = semesters;
                this.loadingClass = false;
            },
            error: (error) => {
                console.error('Error loading classes:', error);
                this.toastService.show('An error occurred while loading classes. Please try again later.', 'error');
                this.loadingClass = false;
            },
        });
    }

    private async loadNotifications(): Promise<void> {
        if (this.loadingNotifications) {
            return;
        }

        this.loadingNotifications = true;
        this.notificationService.getAll(this.notificationFilter).subscribe({
            next: (notifications) => {
                this.notifications = notifications;
                this.notificationFilter.page = notifications.currentPage;
                this.notificationFilter.pageSize = notifications.pageSize;
                this.loadingNotifications = false;
            },
            error: (error) => {
                console.error('Error loading notifications:', error);
                this.toastService.show(
                    'An error occurred while loading notifications. Please try again later.',
                    'error',
                );
                this.loadingNotifications = false;
            },
        });
    }

    // Navigation methods
    navigateToClass(classId: string): void {
        this.router.navigate(['/classes'], { queryParams: { classId } });
    }

    // Notification methods
    switchNotificationTab(type: NotificationType.SYSTEM | NotificationType.STUDENT_ONLY): void {
        if (this.activeNotificationTab === type) {
            return; // No need to switch if already on the same tab
        }

        if (this.loadingNotifications) {
            this.toastService.show('Notifications are currently loading. Please wait.', 'info');
            return;
        }

        this.activeNotificationTab = type;
        this.notificationFilter.scope = type;
        this.notificationFilter.page = 0;
        this.loadNotifications();
    }

    loadNotificationPage(page: number): void {
        if (this.loadingNotifications) {
            this.toastService.show('Notifications are currently loading. Please wait.', 'info');
            return;
        }

        if (page < 0 || page >= this.notifications.totalPages) {
            this.toastService.show('Invalid page number.', 'error');
            return;
        }
        this.notificationFilter.page = page;
        this.loadNotifications();
    }

    openNotificationDetail(notification: NotificationResponse): void {
        this.selectedNotification = notification;
    }

    closeNotificationDetail(): void {
        this.selectedNotification = null;
    }

    // Utility methods
    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    }

    generatePageNumbers(totalPages: number, currentPage: number): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }
}
