import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page } from '../../../core/models/types/page.interface';
import { NotificationResponse } from '../../../core/models/api/notification.model';
import { SemesterResponse, SemesterWithClassesResponse } from '../../../core/models/api/semester.model';
import { mockNotifications, mockSemestersWithClasses } from '../../../core/utils/mockdata.util';
import { ClassResponse } from '../../../core/models/api/class.model';

@Component({
    selector: 'lecturer-home-page',
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class LecturerHomePage implements OnInit {
    // Notifications
    isNotificationOpen = true;
    activeNotificationTab: 'system' | 'lecturer' = 'system';
    systemNotifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 1,
    };
    lecturerNotifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 1,
    };
    selectedNotification: NotificationResponse | null = null;
    isNotificationModalOpen = false;

    // Classes and Semesters
    classesBySemester: SemesterWithClassesResponse[] = [];
    openSemesters: Set<string> = new Set();

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        // Mock data - replace with actual service calls
        this.loadNotifications();
        this.loadSemesters();
    }

    loadNotifications() {
        // Mock system notifications
        this.systemNotifications = {
            content: mockNotifications,
            totalPages: 1,
            currentPage: 1,
        };

        // Mock lecturer notifications
        this.lecturerNotifications = {
            content: mockNotifications,
            totalPages: 1,
            currentPage: 1,
        };
    }

    loadSemesters() {
        // Mock semesters data
        this.classesBySemester = mockSemestersWithClasses;
    }

    // Notification methods
    toggleNotifications() {
        this.isNotificationOpen = !this.isNotificationOpen;
    }

    switchNotificationTab(tab: 'system' | 'lecturer') {
        this.activeNotificationTab = tab;
    }

    getCurrentNotifications(): Page<NotificationResponse> {
        return this.activeNotificationTab === 'system' ? this.systemNotifications : this.lecturerNotifications;
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
        if (this.activeNotificationTab === 'system') {
            this.systemNotifications.currentPage = page;
        } else {
            this.lecturerNotifications.currentPage = page;
        }
        // Load new page data here
    }

    // Semester and class methods
    toggleSemester(semesterId: string) {
        if (this.openSemesters.has(semesterId)) {
            this.openSemesters.delete(semesterId);
        } else {
            this.openSemesters.add(semesterId);
        }
    }

    isSemesterOpen(semesterId: string): boolean {
        return this.openSemesters.has(semesterId);
    }

    getClassesForSemester(semesterId: string): ClassResponse[] {
        return this.classesBySemester.find((semester) => semester.id === semesterId)?.classes || [];
    }

    formatSemesterDisplay(semester: SemesterResponse): string {
        const startDate = semester.startDate.toLocaleDateString('vi-VN');
        const endDate = semester.endDate.toLocaleDateString('vi-VN');
        return `${semester.name} (${startDate} - ${endDate})`;
    }

    getPaginationPages(totalPages: number, currentPage: number): number[] {
        const pages: number[] = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }
}
