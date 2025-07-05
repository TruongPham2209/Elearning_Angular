import { UserService } from './../../../core/services/api/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserFilter, UserRequest, UserResponse } from '../../../core/models/api/user.model';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { Page } from '../../../core/models/types/page.interface';
import { ToastService } from '../../../core/services/ui/toast.service';
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
        content: [],
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
    onFileSelect(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.includes('spreadsheet') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
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
        this.parseExcelFile(file);
    }

    private parseExcelFile(file: File) {
        this.isParsingFile = true;
        this.parsedUsers = [];

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    throw new Error('File Excel phải có ít nhất 2 dòng (header + data)');
                }

                // Get headers
                const headers = jsonData[0] as string[];
                const requiredHeaders = ['username', 'fullname', 'email', 'role'];

                // Validate headers
                const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
                if (missingHeaders.length > 0) {
                    throw new Error(`Thiếu các cột: ${missingHeaders.join(', ')}`);
                }

                // Parse data rows
                const users: UserRequest[] = [];
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row.length === 0 || row.every((cell) => !cell)) continue; // Skip empty rows

                    const user: UserRequest = {
                        username: this.getCellValue(row, headers, 'username'),
                        fullName: this.getCellValue(row, headers, 'fullname'),
                        email: this.getCellValue(row, headers, 'email'),
                        role: 'STUDENT',
                    };

                    // Validate user data
                    if (this.validateUserData(user)) users.push(user);
                }

                this.parsedUsers = users;
                this.isParsingFile = false;

                if (users.length === 0) {
                    this.toastService.show('Không tìm thấy dữ liệu hợp lệ nào trong file', 'warning');
                } else {
                    this.toastService.show(`Đã phân tích thành công ${users.length} người dùng`, 'success');
                }
            } catch (error) {
                this.isParsingFile = false;
                console.error('Error parsing Excel file:', error);
                this.toastService.show(`Lỗi khi phân tích file`, 'error');
            }
        };

        reader.onerror = () => {
            this.isParsingFile = false;
            this.toastService.show('Lỗi khi đọc file', 'error');
        };

        reader.readAsArrayBuffer(file);
    }

    private getCellValue(row: any[], headers: string[], columnName: string): string {
        const index = headers.indexOf(columnName);
        return index >= 0 ? (row[index] || '').toString().trim() : '';
    }

    private validateUserData(user: UserRequest): boolean {
        // Check required fields
        if (!user.username || !user.fullName || !user.email || !user.role) {
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            return false;
        }

        // Validate role
        if (!Object.values(ManagerRole).includes(user.role as ManagerRole)) {
            return false;
        }

        return true;
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
            next: (response) => {
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
        const headers = ['username', 'fullname', 'email', 'role'];
        const sampleData = [
            ['student001', 'Nguyễn Văn A', 'student001@example.com', 'STUDENT'],
            ['lecturer001', 'Trần Thị B', 'lecturer001@example.com', 'LECTURER'],
            ['student002', 'Lê Văn C', 'student002@example.com', 'STUDENT'],
        ];

        const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Users');

        // Auto-size columns
        const colWidths = headers.map((header) => ({ wch: Math.max(header.length, 20) }));
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, 'user_import_template.xlsx');
    }

    // Utility methods
    getRoleDisplayName(role: string): string {
        return role == ManagerRole.LECTURER ? 'Giảng viên' : 'Sinh viên';
    }

    getRoleBadgeClass(role: string): string {
        return role == ManagerRole.LECTURER ? 'badge bg-primary' : 'badge bg-success';
    }
}
