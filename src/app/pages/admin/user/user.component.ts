import { UserService } from './../../../core/services/api/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserFilter, UserRequest, UserResponse } from '../../../core/models/api/user.model';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { Page } from '../../../core/models/types/page.interface';
import { ToastService } from '../../../core/services/ui/toast.service';
import * as FileUtil from '../../../core/utils/file.util';
import * as XLSX from 'xlsx';

@Component({
    selector: 'admin-user-page',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class AdminUserPage implements OnInit {
    @ViewChild('importModalContent') importModalContent!: TemplateRef<any>;
    @ViewChild('previewModalContent') previewModalContent!: TemplateRef<any>;

    // Search and filter properties
    searchQuery: string = '';
    filter: UserFilter = {
        search: '',
        role: null,
        page: 0,
        pageSize: 20,
    };

    // Data properties
    users: Page<UserResponse> = {
        contents: [],
        totalPages: 0,
        pageSize: 0,
        currentPage: 0,
    };
    isLoading: boolean = false;
    currentPage: number = 1; // For ngb-pagination (1-based)

    // Modal properties
    private importModalRef: NgbModalRef | null = null;
    private previewModalRef: NgbModalRef | null = null;
    selectedFile: File | null = null;
    isImporting: boolean = false;
    isParsingFile: boolean = false;

    // Excel parsing
    parsedUsers: UserRequest[] = [];

    // Role options for filter
    roleOptions: { value: ManagerRole | null; label: string }[] = [
        { value: null, label: 'Tất cả vai trò' },
        { value: ManagerRole.LECTURER, label: 'Giảng viên' },
        { value: ManagerRole.STUDENT, label: 'Sinh viên' },
    ];

    constructor(
        private readonly userService: UserService,
        private readonly toastService: ToastService,
        private readonly modalService: NgbModal,
    ) {}

    ngOnInit() {
        this.loadUsers();
    }

    // Load users with current filters and pagination
    loadUsers() {
        this.isLoading = true;
        this.userService.getAll(this.filter).subscribe({
            next: (response) => {
                console.info('Loaded users:', response);
                this.users = response;
                this.filter.page = response.currentPage;
                this.filter.pageSize = response.pageSize;
                this.currentPage = response.currentPage + 1; // Convert to 1-based
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.toastService.show(error.message, 'error');
            },
        });
    }

    // Search functionality
    onSearch() {
        this.searchQuery = this.buildSearchQuery();
        this.filter.page = 0;
        this.currentPage = 1;
        this.loadUsers();
    }

    clearQuery() {
        this.searchQuery = '';
        this.filter.search = '';
        this.filter.role = null;
        this.filter.page = 0;
        this.currentPage = 1;
        this.loadUsers();
    }

    onRoleChange() {
        this.searchQuery = this.buildSearchQuery();
        this.filter.page = 0;
        this.currentPage = 1;
        this.loadUsers();
    }

    private buildSearchQuery(): string {
        const parts: string[] = [];

        if (this.filter.search.trim()) {
            parts.push(`"${this.filter.search.trim()}"`);
        }

        if (this.filter.role) {
            const roleLabel = this.roleOptions.find((r) => r.value === this.filter.role)?.label || '';
            parts.push(`vai trò: ${roleLabel}`);
        }

        return parts.join(', ');
    }

    // Pagination
    onPageChange(page: number) {
        this.filter.page = page - 1;
        this.currentPage = page;
        this.loadUsers();
    }

    // Modal functionality
    openImportModal() {
        this.resetImportState();
        this.importModalRef = this.modalService.open(this.importModalContent, {
            backdrop: 'static',
            keyboard: false,
        });
    }

    showPreviewModal() {
        this.importModalRef?.dismiss();
        this.previewModalRef = this.modalService.open(this.previewModalContent, {
            size: 'lg',
            backdrop: 'static',
        });
    }

    closePreviewModal() {
        this.previewModalRef?.close();
        this.importModalRef = this.modalService.open(this.importModalContent, {
            backdrop: 'static',
            keyboard: false,
        });
    }

    private resetImportState() {
        this.selectedFile = null;
        this.parsedUsers = [];
        this.isImporting = false;
        this.isParsingFile = false;
    }

    // File handling
    async onFileSelect(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size === 0) {
            this.toastService.show('File rỗng. Vui lòng chọn file khác.', 'warning');
            event.target.value = '';
            return;
        }

        // Validate file type
        if (!file.type.includes('spreadsheet') && !file.name.match(/\.(xlsx|xls)$/)) {
            this.toastService.show('Vui lòng chọn file Excel hợp lệ (.xlsx, .xls)', 'warning');
            event.target.value = '';
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.toastService.show('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB', 'warning');
            event.target.value = '';
            return;
        }

        this.selectedFile = file;
        await this.parseExcelFile(file);
    }

    private async parseExcelFile(file: File) {
        try {
            this.isParsingFile = true;
            this.parsedUsers = await FileUtil.parseExcelFileToUsers(file);
            if (this.parsedUsers.length === 0) {
                this.toastService.show('Không tìm thấy dữ liệu hợp lệ nào trong file', 'warning');
            } else {
                this.toastService.show(`Đã phân tích thành công ${this.parsedUsers.length} người dùng`, 'success');
            }
        } catch (error: any) {
            console.error('Error initializing file parsing:', error);
            this.toastService.show(error.message, 'error');
        } finally {
            this.isParsingFile = false;
        }
    }

    // Import functionality
    importUsers(modal: NgbModalRef) {
        if (!this.selectedFile || this.parsedUsers.length === 0) {
            this.toastService.show('Không có dữ liệu để import', 'warning');
            return;
        }

        if (this.isImporting) {
            return; // Prevent multiple requests
        }

        this.isImporting = true;

        this.userService.createBatchingUsers(this.parsedUsers).subscribe({
            next: () => {
                this.toastService.show(`Import thành công ${this.parsedUsers.length} người dùng`, 'success');
                this.isImporting = false;
                modal.close();
                this.resetImportState();
                this.loadUsers(); // Reload data
            },
            error: (error) => {
                this.isImporting = false;
                this.toastService.show(`Lỗi khi import: ${error.message}`, 'error');
                modal.close();
                this.resetImportState();
            },
        });
    }

    downloadTemplate() {
        FileUtil.downloadTemplateUsers();
    }

    // Utility methods
    getRoleDisplayName(role: string): string {
        return role == ManagerRole.LECTURER ? 'Giảng viên' : 'Sinh viên';
    }

    getRoleBadgeClass(role: string): string {
        return role == ManagerRole.LECTURER ? 'badge bg-primary' : 'badge bg-success';
    }
}
