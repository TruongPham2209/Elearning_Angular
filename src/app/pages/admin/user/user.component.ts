import { UserService } from './../../../core/services/api/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserFilter, UserRequest, UserResponse } from '../../../core/models/api/user.model';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { Page } from '../../../core/models/types/page.interface';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'admin-user-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class AdminUserPage implements OnInit {
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
        content: [],
        totalPages: 0,
        pageSize: 0,
        currentPage: 0,
    };
    isLoading: boolean = false;

    // Modal properties
    showImportModal: boolean = false;
    selectedFile: File | null = null;
    isImporting: boolean = false;

    // Role options for filter
    roleOptions: { value: ManagerRole | null; label: string }[] = [
        { value: null, label: 'Tất cả vai trò' },
        { value: ManagerRole.LECTURER, label: 'Giảng viên' },
        { value: ManagerRole.STUDENT, label: 'Sinh viên' },
    ];

    constructor(
        private readonly userService: UserService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit() {
        this.loadUsers();
    }

    // Load users with current filters and pagination
    loadUsers() {
        this.isLoading = true;
        this.userService.getAll(this.filter).subscribe({
            next: (response) => {
                this.users = response;
                this.filter.page = response.currentPage;
                this.filter.pageSize = response.pageSize;
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
        this.loadUsers();
    }

    clearQuery() {
        this.searchQuery = '';
        this.filter.search = '';
        this.filter.role = null;
        this.loadUsers();
    }

    onRoleChange() {
        this.searchQuery = this.buildSearchQuery();
        this.filter.page = 0;
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
    goToPage(page: number) {
        if (page >= 0 && page < this.users.totalPages) {
            this.filter.page = page;
            this.loadUsers();
        }
    }

    getPaginationPages(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(0, this.filter.page - halfVisible);
        let endPage = Math.min(this.users.totalPages - 1, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    // Import functionality
    openImportModal() {
        this.showImportModal = true;
        this.selectedFile = null;
    }

    closeImportModal() {
        this.showImportModal = false;
        this.selectedFile = null;
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            this.selectedFile = file;
        } else {
            this.toastService.show('Vui lòng chọn file Excel hợp lệ', 'warning');
            event.target.value = '';
        }
    }

    importUsers() {
        if (!this.selectedFile) {
            this.toastService.show('Vui lòng chọn file để nhập', 'warning');
            return;
        }

        this.isImporting = true;
        const users: UserRequest[] = []; // This should be populated with parsed data from the file
        this.userService.createBatchingUsers(users).subscribe({
            next: () => {
                this.toastService.show('Nhập người dùng thành công', 'success');
                this.isImporting = false;
                this.closeImportModal();
                this.loadUsers(); // Reload data
            },
            error: (error) => {
                this.isImporting = false;
                this.toastService.show(error.message, 'error');
            },
        });
    }

    downloadTemplate() {
        // Create a simple CSV template
        const template =
            'username,fullname,email,role\nexample_user,Nguyễn Văn A,user@example.com,STUDENT\nexample_lecturer,Trần Thị B,lecturer@example.com,LECTURER';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_import_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Utility methods
    getRoleDisplayName(role: ManagerRole): string {
        return role === ManagerRole.LECTURER ? 'Giảng viên' : 'Sinh viên';
    }

    getRoleBadgeClass(role: ManagerRole): string {
        return role === ManagerRole.LECTURER ? 'badge bg-primary' : 'badge bg-success';
    }
}
