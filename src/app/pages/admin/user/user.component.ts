import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Interfaces
export interface User {
    id: number;
    username: string;
    fullname: string;
    email: string;
    role: 'LECTURER' | 'STUDENT';
}

export type UserRole = 'ALL' | 'LECTURER' | 'STUDENT';

@Component({
    selector: 'admin-user-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class AdminUserPage implements OnInit {
    // Search and filter properties
    searchTerm: string = '';
    selectedRole: UserRole = 'ALL';
    searchQuery: string = '';

    // Pagination properties
    currentPage: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;

    // Data properties
    users: User[] = [];
    isLoading: boolean = false;

    // Modal properties
    showImportModal: boolean = false;
    selectedFile: File | null = null;
    isImporting: boolean = false;

    // Role options for filter
    roleOptions: { value: UserRole; label: string }[] = [
        { value: 'ALL', label: 'Tất cả vai trò' },
        { value: 'LECTURER', label: 'Giảng viên' },
        { value: 'STUDENT', label: 'Sinh viên' },
    ];

    ngOnInit() {
        this.loadUsers();
    }

    // Load users with current filters and pagination
    loadUsers() {
        this.isLoading = true;

        // Simulate API call
        setTimeout(() => {
            // Mock data - replace with actual API call
            const mockUsers: User[] = [
                { id: 1, username: 'john_doe', fullname: 'John Doe', email: 'john@example.com', role: 'STUDENT' },
                { id: 2, username: 'jane_smith', fullname: 'Jane Smith', email: 'jane@example.com', role: 'LECTURER' },
                { id: 3, username: 'bob_wilson', fullname: 'Bob Wilson', email: 'bob@example.com', role: 'STUDENT' },
                {
                    id: 4,
                    username: 'alice_brown',
                    fullname: 'Alice Brown',
                    email: 'alice@example.com',
                    role: 'LECTURER',
                },
                {
                    id: 5,
                    username: 'charlie_davis',
                    fullname: 'Charlie Davis',
                    email: 'charlie@example.com',
                    role: 'STUDENT',
                },
            ];

            // Apply filters
            let filteredUsers = mockUsers;

            if (this.searchTerm.trim()) {
                const searchLower = this.searchTerm.toLowerCase();
                filteredUsers = filteredUsers.filter(
                    (user) =>
                        user.fullname.toLowerCase().includes(searchLower) ||
                        user.email.toLowerCase().includes(searchLower),
                );
            }

            if (this.selectedRole !== 'ALL') {
                filteredUsers = filteredUsers.filter((user) => user.role === this.selectedRole);
            }

            // Mock pagination
            this.totalPages = Math.ceil(filteredUsers.length / this.pageSize);
            const startIndex = this.currentPage * this.pageSize;
            this.users = filteredUsers.slice(startIndex, startIndex + this.pageSize);

            this.isLoading = false;
        }, 1000);
    }

    // Search functionality
    onSearch() {
        this.searchQuery = this.buildSearchQuery();
        this.currentPage = 0;
        this.loadUsers();
    }

    onRoleChange() {
        this.searchQuery = this.buildSearchQuery();
        this.currentPage = 0;
        this.loadUsers();
    }

    private buildSearchQuery(): string {
        const parts: string[] = [];

        if (this.searchTerm.trim()) {
            parts.push(`"${this.searchTerm.trim()}"`);
        }

        if (this.selectedRole !== 'ALL') {
            const roleLabel = this.roleOptions.find((r) => r.value === this.selectedRole)?.label || '';
            parts.push(`vai trò: ${roleLabel}`);
        }

        return parts.join(', ');
    }

    // Pagination
    goToPage(page: number) {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadUsers();
        }
    }

    getPaginationPages(): number[] {
        const pages: number[] = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(0, this.currentPage - halfVisible);
        let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);

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
            alert('Vui lòng chọn file Excel (.xlsx)');
            event.target.value = '';
        }
    }

    importUsers() {
        if (!this.selectedFile) {
            alert('Vui lòng chọn file để import');
            return;
        }

        this.isImporting = true;

        // Simulate import process
        setTimeout(() => {
            this.isImporting = false;
            this.closeImportModal();
            alert('Import thành công!');
            this.loadUsers(); // Reload data
        }, 2000);
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
    getRoleDisplayName(role: string): string {
        return role === 'LECTURER' ? 'Giảng viên' : 'Sinh viên';
    }

    getRoleBadgeClass(role: string): string {
        return role === 'LECTURER' ? 'badge bg-primary' : 'badge bg-success';
    }
}
