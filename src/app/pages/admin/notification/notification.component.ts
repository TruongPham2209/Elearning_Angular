import { NotificationUtil } from './../../../core/models/enum/notification.model';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Page } from '../../../core/models/types/page.interface';
import {
    lecturerNotificationOption,
    NotificationOption,
    NotificationType,
    studentNotificationOption,
    systemNotificationOption,
} from '../../../core/models/enum/notification.model';
import { NotificationFilter, NotificationResponse } from '../../../core/models/api/notification.model';
import { mockNotifications } from '../../../core/utils/mockdata.util';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'admin-notification-page',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class AdminNotificationPage implements OnInit {
    createModalRef: any;
    deleteModalRef: any;
    detailModalRef: any;

    // Enums for template
    NotificationUtil = NotificationUtil;

    // Data properties
    notifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
    };

    // Filter and pagination
    filter: NotificationFilter = {
        scope: NotificationType.SYSTEM,
        page: 0,
        size: 10,
    };

    // Loading states
    isLoading = false;
    isCreating = false;

    // Modal data
    selectedNotification: NotificationResponse | null = null;
    notificationToDelete: NotificationResponse | null = null;

    // Form data
    newNotification = {
        title: '',
        type: NotificationType.SYSTEM,
        detail: '',
    };

    notificationTypes: NotificationOption[] = [
        systemNotificationOption,
        lecturerNotificationOption,
        studentNotificationOption,
    ];

    // Pagination helper
    pages: number[] = [];

    // Mock data
    mockNotifications: NotificationResponse[] = mockNotifications;

    constructor(private modalService: NgbModal) {}

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
            filteredNotifications = this.mockNotifications.filter((n) => n.receiverScope === this.filter.scope);

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
    viewNotificationDetail(notification: NotificationResponse, content: TemplateRef<any>): void {
        this.selectedNotification = notification;
        this.detailModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    openCreateNotificationModal(content: TemplateRef<any>): void {
        // Open modal
        this.createModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    setNotificationToDelete(notification: NotificationResponse, content: TemplateRef<any>): void {
        this.notificationToDelete = notification;
        this.deleteModalRef = this.modalService.open(content, { centered: true });
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
            const newNotification: NotificationResponse = {
                id: (this.mockNotifications.length + 1).toString(),
                title: this.newNotification.title,
                receiverScope: this.newNotification.type,
                content: this.newNotification.detail,
                createdAt: new Date(),
                sender: 'Admin',
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
            if (this.createModalRef) {
                this.createModalRef.close();
            }
        }, 1000);
    }

    disableCreateButton(): boolean {
        return (
            this.isCreating ||
            this.newNotification.title.trim() === '' ||
            this.newNotification.detail.trim() == '' ||
            !this.newNotification.type
        );
    }
}
