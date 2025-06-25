import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Page } from '../../../core/models/types/page.interface';

// Enums và Interfaces
export enum NotificationType {
    SYSTEM = 'SYSTEM',
    LECTURER_ONLY = 'LECTURER_ONLY',
    STUDENT_ONLY = 'STUDENT_ONLY',
}

export interface Notification {
    id: string;
    title: string;
    type: NotificationType;
    detail: string;
    createdAt: string;
    createdBy: string;
}

export interface NotificationFilter {
    type: NotificationType | 'ALL';
    page: number;
    size: number;
}

@Component({
    selector: 'admin-notification-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class AdminNotificationPage implements OnInit {
    // Enums for template
    NotificationType = NotificationType;

    // Data properties
    notifications: Page<Notification> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
    };

    // Filter and pagination
    filter: NotificationFilter = {
        type: 'ALL',
        page: 0,
        size: 10,
    };

    // Loading states
    isLoading = false;
    isCreating = false;

    // Modal data
    selectedNotification: Notification | null = null;
    notificationToDelete: Notification | null = null;

    // Form data
    newNotification = {
        title: '',
        type: NotificationType.SYSTEM,
        detail: '',
    };

    // Pagination helper
    pages: number[] = [];

    // Mock data
    mockNotifications: Notification[] = [
        {
            id: '1',
            title: 'Thông báo bảo trì hệ thống',
            type: NotificationType.SYSTEM,
            detail: '<p>Hệ thống sẽ được <strong>bảo trì</strong> vào ngày <em>15/01/2025</em> từ 22:00 đến 02:00 sáng ngày hôm sau.</p><p>Trong thời gian này, các chức năng có thể bị gián đoạn. Vui lòng hoàn thành công việc trước thời điểm trên.</p>',
            createdAt: '2025-01-10T10:30:00',
            createdBy: 'Admin System',
        },
        {
            id: '2',
            title: 'Hướng dẫn sử dụng tính năng mới',
            type: NotificationType.LECTURER_ONLY,
            detail: '<p>Chúng tôi đã cập nhật <strong>tính năng chấm điểm tự động</strong> cho giảng viên.</p><ul><li>Truy cập menu "Chấm điểm"</li><li>Chọn lớp học cần chấm</li><li>Sử dụng template Excel mới</li></ul><p>Liên hệ IT nếu cần hỗ trợ.</p>',
            createdAt: '2025-01-09T14:15:00',
            createdBy: 'Phòng Đào Tạo',
        },
        {
            id: '3',
            title: 'Thông báo lịch thi giữa kỳ',
            type: NotificationType.STUDENT_ONLY,
            detail: '<p><strong>Lịch thi giữa kỳ</strong> học kỳ I năm học 2024-2025:</p><p>📅 <strong>Thời gian:</strong> 20/01/2025 - 25/01/2025</p><p>📝 <strong>Hình thức:</strong> Thi trực tuyến</p><p>⏰ <strong>Thời gian làm bài:</strong> 90 phút</p><p><em>Sinh viên vui lòng chuẩn bị đầy đủ thiết bị và kết nối internet ổn định.</em></p>',
            createdAt: '2025-01-08T09:00:00',
            createdBy: 'Phòng Đào Tạo',
        },
        {
            id: '4',
            title: 'Cập nhật chính sách học phí',
            type: NotificationType.SYSTEM,
            detail: '<p>Thông báo về <strong>chính sách học phí</strong> mới áp dụng từ học kỳ II:</p><p>💰 Học phí sẽ được điều chỉnh theo quy định mới</p><p>📋 Sinh viên có thể tra cứu chi tiết tại mục "Học phí"</p><p>❓ Mọi thắc mắc vui lòng liên hệ phòng Tài chính</p>',
            createdAt: '2025-01-07T16:45:00',
            createdBy: 'Phòng Tài Chính',
        },
        {
            id: '5',
            title: 'Workshop "Kỹ năng thuyết trình"',
            type: NotificationType.LECTURER_ONLY,
            detail: '<p>Mời các giảng viên tham gia <strong>Workshop "Kỹ năng thuyết trình hiệu quả"</strong></p><p>🕐 <strong>Thời gian:</strong> 14:00 - 17:00, thứ Bảy 18/01/2025</p><p>📍 <strong>Địa điểm:</strong> Hội trường A1</p><p>👥 <strong>Diễn giả:</strong> TS. Nguyễn Văn A</p><p><em>Đăng ký tham gia trước 15/01/2025</em></p>',
            createdAt: '2025-01-06T11:20:00',
            createdBy: 'Phòng Nhân Sự',
        },
    ];

    constructor() {}

    ngOnInit(): void {
        this.loadNotifications();
    }

    // Load notifications with filter and pagination
    loadNotifications(): void {
        this.isLoading = true;

        // Simulate API call
        setTimeout(() => {
            let filteredNotifications = this.mockNotifications;

            // Apply type filter
            if (this.filter.type !== 'ALL') {
                filteredNotifications = this.mockNotifications.filter((n) => n.type === this.filter.type);
            }

            // Apply pagination
            const startIndex = this.filter.page * this.filter.size;
            const endIndex = startIndex + this.filter.size;
            const paginatedContent = filteredNotifications.slice(startIndex, endIndex);

            this.notifications = {
                content: paginatedContent,
                totalPages: Math.ceil(filteredNotifications.length / this.filter.size),
                currentPage: this.filter.page,
            };

            this.updatePagination();
            this.isLoading = false;
        }, 800);
    }

    // Filter change handler
    onFilterChange(): void {
        this.filter.page = 0; // Reset to first page
        this.loadNotifications();
    }

    // Pagination handlers
    goToPage(page: number): void {
        if (page >= 0 && page < this.notifications.totalPages) {
            this.filter.page = page;
            this.loadNotifications();
        }
    }

    previousPage(): void {
        if (this.filter.page > 0) {
            this.filter.page--;
            this.loadNotifications();
        }
    }

    nextPage(): void {
        if (this.filter.page < this.notifications.totalPages - 1) {
            this.filter.page++;
            this.loadNotifications();
        }
    }

    private updatePagination(): void {
        const currentPage = this.notifications.currentPage;
        const totalPages = this.notifications.totalPages;
        const pages: number[] = [];

        // Show max 5 pages around current page
        const maxPagesToShow = 5;
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        this.pages = pages;
    }

    // Modal handlers
    viewNotificationDetail(notification: Notification): void {
        this.selectedNotification = notification;
    }

    confirmDelete(notification: Notification): void {
        this.notificationToDelete = notification;
    }

    deleteNotification(): void {
        if (this.notificationToDelete) {
            // Simulate API call
            const index = this.mockNotifications.findIndex((n) => n.id === this.notificationToDelete!.id);
            if (index !== -1) {
                this.mockNotifications.splice(index, 1);
            }

            this.notificationToDelete = null;
            this.loadNotifications();

            // Close modal
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal?.hide();
        }
    }

    // Create notification
    createNotification(): void {
        if (!this.newNotification.title || !this.newNotification.detail) {
            return;
        }

        this.isCreating = true;

        // Simulate API call
        setTimeout(() => {
            const newNotification: Notification = {
                id: (this.mockNotifications.length + 1).toString(),
                title: this.newNotification.title,
                type: this.newNotification.type,
                detail: this.newNotification.detail,
                createdAt: new Date().toISOString(),
                createdBy: 'Admin',
            };

            this.mockNotifications.unshift(newNotification);
            this.loadNotifications();

            // Reset form
            this.newNotification = {
                title: '',
                type: NotificationType.SYSTEM,
                detail: '',
            };

            this.isCreating = false;

            // Close modal
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('createModal'));
            modal?.hide();
        }, 1000);
    }

    // Utility methods
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    getTypeLabel(type: NotificationType): string {
        const labels = {
            [NotificationType.SYSTEM]: 'Hệ thống',
            [NotificationType.LECTURER_ONLY]: 'Giảng viên',
            [NotificationType.STUDENT_ONLY]: 'Sinh viên',
        };
        return labels[type];
    }

    getTypeBadgeClass(type: NotificationType): string {
        const classes = {
            [NotificationType.SYSTEM]: 'bg-primary',
            [NotificationType.LECTURER_ONLY]: 'bg-success',
            [NotificationType.STUDENT_ONLY]: 'bg-info',
        };
        return classes[type];
    }

    updateNotificationDetail(event: Event): void {
        const target = event.target as HTMLElement;
        if (target) {
            this.newNotification.detail = target.innerHTML;
        }
    }
}
