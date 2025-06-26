import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Page } from '../../../core/models/types/page.interface';

export interface Notification {
    id: string;
    title: string;
    detail: string;
    createdAt: Date;
    createBy: string;
}

export interface Semester {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
}

export interface ClassRoom {
    id: string;
    name: string;
    room: string;
    schedule: string;
}

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
    systemNotifications: Page<Notification> = {
        content: [],
        totalPages: 0,
        currentPage: 1,
    };
    lecturerNotifications: Page<Notification> = {
        content: [],
        totalPages: 0,
        currentPage: 1,
    };
    selectedNotification: Notification | null = null;
    isNotificationModalOpen = false;

    // Classes and Semesters
    semesters: Semester[] = [];
    classesBySemester: { [semesterId: string]: ClassRoom[] } = {};
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
            content: [
                {
                    id: '1',
                    title: 'Thông báo bảo trì hệ thống',
                    detail: 'Hệ thống sẽ được bảo trì vào ngày 30/06/2025 từ 22:00 đến 02:00 sáng ngày hôm sau. Trong thời gian này, hệ thống có thể không hoạt động ổn định.',
                    createdAt: new Date('2025-06-25'),
                    createBy: 'Quản trị viên hệ thống',
                },
                {
                    id: '2',
                    title: 'Cập nhật tính năng mới',
                    detail: 'Hệ thống đã được cập nhật với các tính năng mới: Quản lý điểm danh tự động, Báo cáo tiến độ học tập chi tiết.',
                    createdAt: new Date('2025-06-20'),
                    createBy: 'Quản trị viên hệ thống',
                },
            ],
            totalPages: 1,
            currentPage: 1,
        };

        // Mock lecturer notifications
        this.lecturerNotifications = {
            content: [
                {
                    id: '3',
                    title: 'Họp khoa về kế hoạch học kỳ mới',
                    detail: 'Cuộc họp sẽ diễn ra vào thứ 2 tuần tới lúc 14:00 tại phòng họp A.101. Nội dung: Thảo luận kế hoạch giảng dạy học kỳ 2025-2026.',
                    createdAt: new Date('2025-06-24'),
                    createBy: 'Trưởng khoa CNTT',
                },
                {
                    id: '4',
                    title: 'Thông báo về lịch thi cuối kỳ',
                    detail: 'Lịch thi cuối kỳ đã được cập nhật. Vui lòng kiểm tra và xác nhận lịch coi thi của mình.',
                    createdAt: new Date('2025-06-22'),
                    createBy: 'Phòng Đào tạo',
                },
            ],
            totalPages: 1,
            currentPage: 1,
        };
    }

    loadSemesters() {
        // Mock semesters data
        this.semesters = [
            {
                id: '1',
                name: 'Học kỳ I',
                startDate: new Date('2025-09-01'),
                endDate: new Date('2025-12-31'),
            },
            {
                id: '2',
                name: 'Học kỳ II',
                startDate: new Date('2026-01-15'),
                endDate: new Date('2026-05-31'),
            },
        ];

        // Mock classes data
        this.classesBySemester = {
            '1': [
                {
                    id: '1',
                    name: 'Lập trình Web - Lớp A',
                    room: 'A.301',
                    schedule: 'Thứ 2, 4, 6 - 7:30-9:30',
                },
                {
                    id: '2',
                    name: 'Cơ sở dữ liệu - Lớp B',
                    room: 'B.205',
                    schedule: 'Thứ 3, 5 - 13:30-15:30',
                },
            ],
            '2': [
                {
                    id: '3',
                    name: 'Phát triển ứng dụng Mobile',
                    room: 'C.102',
                    schedule: 'Thứ 2, 4 - 9:30-11:30',
                },
            ],
        };
    }

    // Notification methods
    toggleNotifications() {
        this.isNotificationOpen = !this.isNotificationOpen;
    }

    switchNotificationTab(tab: 'system' | 'lecturer') {
        this.activeNotificationTab = tab;
    }

    getCurrentNotifications(): Page<Notification> {
        return this.activeNotificationTab === 'system' ? this.systemNotifications : this.lecturerNotifications;
    }

    openNotificationModal(notification: Notification) {
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

    getClassesForSemester(semesterId: string): ClassRoom[] {
        return this.classesBySemester[semesterId] || [];
    }

    formatSemesterDisplay(semester: Semester): string {
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
