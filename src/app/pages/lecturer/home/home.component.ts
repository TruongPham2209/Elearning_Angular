import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationFilter, NotificationResponse } from '../../../core/models/api/notification.model';
import { SemesterWithClassesResponse } from '../../../core/models/api/semester.model';
import { NotificationType } from '../../../core/models/enum/notification.model';
import { Page } from '../../../core/models/types/page.interface';
import { ClassService } from '../../../core/services/api/class.service';
import { NotificationService } from '../../../core/services/api/notification.service';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'lecturer-home-page',
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class LecturerHomePage implements OnInit {
    // Notifications
    isNotificationOpen = true;
    isNotificationModalOpen = false;

    isLoadingNotifications = false;
    isLoadingSemesters = false;

    NotificationType = NotificationType;
    selectedNotification: NotificationResponse | null = null;
    activeNotificationTab: NotificationType.SYSTEM | NotificationType.LECTURER_ONLY = NotificationType.SYSTEM;
    filter: NotificationFilter = {
        scope: NotificationType.SYSTEM,
        page: 0,
        pageSize: 10,
    };
    notifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 1,
        currentPage: 0,
        pageSize: 10,
    };

    // Classes and Semesters
    classesBySemester: SemesterWithClassesResponse[] = [];
    openSemesters: Set<string> = new Set();

    constructor(
        private readonly toastService: ToastService,
        private readonly classService: ClassService,
        private readonly notificationService: NotificationService,
    ) {}

    ngOnInit() {
        this.loadNotifications();
        this.loadSemesters();
    }

    loadNotifications() {
        if (this.isLoadingNotifications) {
            return;
        }

        this.isLoadingNotifications = true;
        this.filter.scope = this.activeNotificationTab;
        this.notificationService.getAll(this.filter).subscribe({
            next: (notifications) => {
                this.notifications = notifications;
                this.filter.page = notifications.currentPage;
                this.filter.pageSize = notifications.pageSize;
                this.isLoadingNotifications = false;
            },
            error: (error) => {
                console.error('Error loading notifications:', error);
                this.toastService.show(
                    'An error occurred while loading notifications. Please try again later.',
                    'error',
                );
                this.isLoadingNotifications = false;
            },
        });
    }

    loadSemesters() {
        this.isLoadingSemesters = true;
        this.classService.getClasses().subscribe({
            next: (semesters) => {
                this.classesBySemester = semesters;
                this.openSemesters.clear();
                this.isLoadingSemesters = false;
            },
            error: (error) => {
                console.error('Error loading semesters:', error);
                this.toastService.show('An error occurred while loading semesters. Please try again later.', 'error');
                this.isLoadingSemesters = false;
            },
        });
    }

    // Notification methods
    toggleNotifications() {
        this.isNotificationOpen = !this.isNotificationOpen;
    }

    switchNotificationTab(tab: NotificationType.SYSTEM | NotificationType.LECTURER_ONLY) {
        if (this.activeNotificationTab === tab || this.isLoadingNotifications) {
            this.toastService.show('Đang tải thông báo, vui lòng đợi trong giây lát.', 'info');
            return;
        }

        this.activeNotificationTab = tab;
        this.filter.scope = tab;
        this.filter.page = 0;
        this.loadNotifications();
    }

    openNotificationModal(notification: NotificationResponse) {
        this.selectedNotification = notification;
        this.isNotificationModalOpen = true;
    }

    closeNotificationModal() {
        this.isNotificationModalOpen = false;
        this.selectedNotification = null;
    }

    changeNotificationPage(page: number) {
        if (page < 0 || page >= this.notifications.totalPages) {
            return;
        }

        this.filter.page = page;
        this.loadNotifications();
    }

    // Semester and class methods
    toggleSemester(semesterId: string) {
        this.openSemesters.has(semesterId) ? this.openSemesters.delete(semesterId) : this.openSemesters.add(semesterId);
    }

    getPaginationPages(totalPages: number): number[] {
        const pages: number[] = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }
}
