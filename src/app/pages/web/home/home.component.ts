import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationResponse } from '../../../core/models/api/notification.model';
import { SemesterWithClassesResponse } from '../../../core/models/api/semester.model';
import { Page } from '../../../core/models/types/page.interface';
import { NotificationType } from '../../../core/models/enum/notification.model';

@Component({
    selector: 'web-home-page',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class WebHomePage implements OnInit {
    semesters: SemesterWithClassesResponse[] = [];

    // Notification data
    systemNotifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
    };

    studentNotifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
    };

    activeNotificationTab: NotificationType = NotificationType.SYSTEM;
    NotificationType = NotificationType;

    // Loading states
    loading = true;
    loadingSystemNotifications = false;
    loadingStudentNotifications = false;

    // Selected notification for modal
    selectedNotification: NotificationResponse | null = null;

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        this.loading = true;
        try {
            await Promise.all([
                this.loadSemesters(),
                this.loadNotifications(NotificationType.SYSTEM, 0),
                this.loadNotifications(NotificationType.STUDENT_ONLY, 0),
            ]);
        } finally {
            this.loading = false;
        }
    }

    private async loadSemesters(): Promise<void> {
        // Mock data - replace with actual API call
        this.semesters = [
            {
                id: '1',
                title: 'Học kỳ 1 - 2024-2025',
                classes: [
                    {
                        id: 'class1',
                        name: 'Lập trình Web nâng cao',
                        room: 'A101',
                        schedule: 'Thứ 2, 7:30-9:30',
                        lecturerId: 'lecturer1',
                        lecturerName: 'Nguyễn Văn A',
                        lecturerEmail: 'nguyenvana@example.com',
                    },
                    {
                        id: 'class2',
                        name: 'Cơ sở dữ liệu',
                        room: 'B202',
                        schedule: 'Thứ 4, 13:30-15:30',
                        lecturerId: 'lecturer2',
                        lecturerName: 'Trần Thị B',
                        lecturerEmail: 'tranthib@example.com',
                    },
                ],
            },
            {
                id: '2',
                title: 'Học kỳ 2 - 2024-2025',
                classes: [
                    {
                        id: 'class3',
                        name: 'Phát triển ứng dụng di động',
                        room: 'C303',
                        schedule: 'Thứ 3, 9:30-11:30',
                        lecturerId: 'lecturer3',
                        lecturerName: 'Lê Văn C',
                        lecturerEmail: 'levanc@example.com',
                    },
                ],
            },
        ];
    }

    private async loadNotifications(type: NotificationType, page: number): Promise<void> {
        const isSystem = type === NotificationType.SYSTEM;

        if (isSystem) {
            this.loadingSystemNotifications = true;
        } else {
            this.loadingStudentNotifications = true;
        }

        try {
            // Mock data - replace with actual API call
            const mockNotifications: Page<NotificationResponse> = {
                content: isSystem
                    ? [
                          //   {
                          //       id: 'sys1',
                          //       title: 'Thông báo bảo trì hệ thống',
                          //       createdAt: new Date('2024-06-25'),
                          //       createdBy: 'Quản trị viên',
                          //   },
                          //   {
                          //       id: 'sys2',
                          //       title: 'Cập nhật chính sách học tập mới',
                          //       createdAt: new Date('2024-06-24'),
                          //       createdBy: 'Phòng Đào tạo',
                          //   },
                      ]
                    : [
                          //   {
                          //       id: 'stu1',
                          //       title: 'Thông báo nộp bài tập lớn môn Lập trình Web',
                          //       createdAt: new Date('2024-06-25'),
                          //       createdBy: 'Nguyễn Văn A',
                          //   },
                          //   {
                          //       id: 'stu2',
                          //       title: 'Lịch thi giữa kỳ môn Cơ sở dữ liệu',
                          //       createdAt: new Date('2024-06-23'),
                          //       createdBy: 'Trần Thị B',
                          //   },
                      ],
                totalPages: 3,
                currentPage: page,
            };

            if (isSystem) {
                this.systemNotifications = mockNotifications;
            } else {
                this.studentNotifications = mockNotifications;
            }
        } finally {
            if (isSystem) {
                this.loadingSystemNotifications = false;
            } else {
                this.loadingStudentNotifications = false;
            }
        }
    }

    // Navigation methods
    navigateToClass(classId: string): void {
        this.router.navigate(['/classes'], { queryParams: { classId } });
    }

    // Notification methods
    switchNotificationTab(type: NotificationType): void {
        this.activeNotificationTab = type;
    }

    getCurrentNotifications(): Page<NotificationResponse> {
        return this.activeNotificationTab === NotificationType.SYSTEM
            ? this.systemNotifications
            : this.studentNotifications;
    }

    isCurrentTabLoading(): boolean {
        return this.activeNotificationTab === NotificationType.SYSTEM
            ? this.loadingSystemNotifications
            : this.loadingStudentNotifications;
    }

    loadNotificationPage(page: number): void {
        this.loadNotifications(this.activeNotificationTab, page);
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
