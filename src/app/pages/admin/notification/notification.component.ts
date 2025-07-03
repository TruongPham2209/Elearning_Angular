import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { toolbarOptions } from '../../../core/configs/editor.config';
import {
    NotificationFilter,
    NotificationRequest,
    NotificationResponse,
} from '../../../core/models/api/notification.model';
import {
    lecturerNotificationOption,
    NotificationOption,
    NotificationType,
    studentNotificationOption,
    systemNotificationOption,
} from '../../../core/models/enum/notification.model';
import { Page } from '../../../core/models/types/page.interface';
import { NotificationService } from '../../../core/services/api/notification.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { NotificationUtil } from './../../../core/models/enum/notification.model';

@Component({
    selector: 'admin-notification-page',
    imports: [CommonModule, FormsModule, NgbModule, NgxEditorComponent, NgxEditorMenuComponent],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
})
export class AdminNotificationPage implements OnInit, OnDestroy {
    createModalRef: any;
    deleteModalRef: any;
    detailModalRef: any;

    // Enums for template
    NotificationUtil = NotificationUtil;
    editor!: Editor;
    toolBar: Toolbar = toolbarOptions;

    // Data properties
    notifications: Page<NotificationResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    // Filter and pagination
    filter: NotificationFilter = {
        scope: NotificationType.SYSTEM,
        page: 0,
        pageSize: 10,
    };

    // Loading states
    isLoading = false;
    isCreating = false;

    // Modal data
    selectedNotification: NotificationResponse | null = null;
    notificationToDelete: NotificationResponse | null = null;

    // Form data
    newNotification: NotificationRequest = {
        title: '',
        receiverScope: NotificationType.SYSTEM,
        content: '',
    };

    notificationTypes: NotificationOption[] = [
        systemNotificationOption,
        lecturerNotificationOption,
        studentNotificationOption,
    ];

    // Pagination helper
    pages: number[] = [];

    constructor(
        private readonly modalService: NgbModal,
        private readonly notificationService: NotificationService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.loadNotifications();
        if (!this.editor) {
            this.editor = new Editor({
                history: true,
                keyboardShortcuts: true,
                inputRules: true,
            });
        }
    }

    ngOnDestroy(): void {
        this.editor?.destroy();
        this.createModalRef?.close();
        this.deleteModalRef?.close();
        this.detailModalRef?.close();
    }

    // Load notifications with filter and pagination
    loadNotifications(): void {
        this.isLoading = true;
        this.notificationService.getAll(this.filter).subscribe({
            next: (response) => {
                this.notifications = response;
                this.updatePagination();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading notifications:', error);
                this.toastService.show(error.message, 'error');
                this.isLoading = false;
            },
        });
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
        this.createModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    setNotificationToDelete(notification: NotificationResponse, content: TemplateRef<any>): void {
        this.notificationToDelete = notification;
        this.deleteModalRef = this.modalService.open(content, { centered: true });
    }

    deleteNotification(): void {
        if (this.notificationToDelete) {
            this.notificationService.delete(this.notificationToDelete.id).subscribe({
                next: () => {
                    this.toastService.show('Thông báo đã được xóa thành công.', 'success');
                    this.notifications.content = this.notifications.content.filter(
                        (n) => n.id !== this.notificationToDelete?.id,
                    );
                    this.notificationToDelete = null;
                    this.deleteModalRef?.close();
                },
                error: (error) => {
                    console.error('Error deleting notification:', error);
                    this.toastService.show(error.message, 'error');
                    this.notificationToDelete = null;
                    this.deleteModalRef?.close();
                },
            });
        }
    }

    // Create notification
    createNotification(): void {
        if (this.disableCreateButton()) {
            return;
        }

        this.isCreating = true;

        // Simulate API call
        this.notificationService.create(this.newNotification).subscribe({
            next: (response) => {
                this.toastService.show('Thông báo đã được tạo thành công.', 'success');
                this.notifications.content.unshift(response); // Add to the beginning of the list
                this.resetForm();
            },
            error: (error) => {
                console.error('Error creating notification:', error);
                this.toastService.show(error.message, 'error');
                this.resetForm();
            },
        });
    }

    disableCreateButton(): boolean {
        return (
            this.isCreating ||
            this.newNotification.title.trim() === '' ||
            this.newNotification.content.trim() == '' ||
            !this.newNotification.receiverScope
        );
    }

    private resetForm(): void {
        this.newNotification = {
            title: '',
            receiverScope: NotificationType.SYSTEM,
            content: '',
        };
        this.isCreating = false;
        this.createModalRef?.close();
    }
}
