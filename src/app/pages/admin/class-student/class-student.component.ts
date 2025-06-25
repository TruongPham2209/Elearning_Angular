import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Interface cho Student data
interface Student {
    id: string;
    username: string; // MSSV
    fullname: string;
    email: string;
    isBanned: boolean;
    isSelected?: boolean; // Cho việc select để ban
}

// Interface cho Banned Student data
interface BannedStudent {
    username: string;
    fullname: string;
    reason: string;
    details: string;
    bannedBy: string;
    bannedDate: string;
}

// Interface cho Class data
interface ClassData {
    id: string;
    name: string;
    courseId: string;
}

@Component({
    selector: 'app-class-student',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './class-student.component.html',
    styleUrl: './class-student.component.scss',
})
export class AdminClassStudentPage implements OnInit {
    classId: string = '';
    currentClass: ClassData | null = null;
    activeTab: 'students' | 'banned' = 'students';
    isLoading: boolean = false;

    students: Student[] = [];
    bannedStudents: BannedStudent[] = [];

    banData = {
        reason: '',
        details: '',
    };

    // Mock data cho classes
    private mockClasses: ClassData[] = [
        { id: '1', name: 'Frontend-K1', courseId: '1' },
        { id: '2', name: 'Frontend-K2', courseId: '1' },
        { id: '3', name: 'Mobile-K1', courseId: '2' },
    ];

    // Mock data cho students
    private mockStudents: Student[] = [
        {
            id: '1',
            username: 'SV001',
            fullname: 'Nguyễn Văn An',
            email: 'nva@example.com',
            isBanned: false,
            isSelected: false,
        },
        {
            id: '2',
            username: 'SV002',
            fullname: 'Trần Thị Bình',
            email: 'ttb@example.com',
            isBanned: false,
            isSelected: false,
        },
        {
            id: '3',
            username: 'SV003',
            fullname: 'Lê Văn Cường',
            email: 'lvc@example.com',
            isBanned: false,
            isSelected: false,
        },
        {
            id: '4',
            username: 'SV004',
            fullname: 'Phạm Thị Dung',
            email: 'ptd@example.com',
            isBanned: true,
            isSelected: false,
        },
    ];

    // Mock data cho banned students
    private mockBannedStudents: BannedStudent[] = [
        {
            username: 'SV004',
            fullname: 'Phạm Thị Dung',
            reason: 'Vi phạm quy định',
            details: 'Thường xuyên đi muộn, không tham gia đầy đủ các hoạt động học tập',
            bannedBy: 'Admin',
            bannedDate: '2024-01-15',
        },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Lấy classId từ query params
        this.route.queryParams.subscribe((params) => {
            this.classId = params['classId'];

            if (!this.classId) {
                // Nếu không có classId, redirect về dashboard
                this.router.navigate(['/admin/dashboard']);
                return;
            }

            this.loadClassData();
            this.loadStudents();
        });
    }

    private loadClassData(): void {
        // Simulate API call để lấy thông tin class
        this.currentClass = this.mockClasses.find((cls) => cls.id === this.classId) || null;

        if (!this.currentClass) {
            // Nếu không tìm thấy class, redirect về dashboard
            this.router.navigate(['/admin/dashboard']);
        }
    }

    private loadStudents(): void {
        this.isLoading = true;

        // Simulate API call với loading delay
        setTimeout(() => {
            this.students = [...this.mockStudents].map((student) => ({
                ...student,
                isSelected: false,
            }));
            this.bannedStudents = [...this.mockBannedStudents];
            this.isLoading = false;
        }, 800);
    }

    switchTab(tab: 'students' | 'banned'): void {
        if (this.activeTab === tab) return;

        this.activeTab = tab;
        this.isLoading = true;

        // Simulate loading delay khi switch tab
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
    }

    toggleSelectAll(event: any): void {
        const isSelected = event.target.checked;
        this.students.forEach((student) => {
            if (!student.isBanned) {
                // Chỉ select những student chưa bị ban
                student.isSelected = isSelected;
            }
        });
    }

    isAllSelected(): boolean {
        const activeStudents = this.students.filter((s) => !s.isBanned);
        return activeStudents.length > 0 && activeStudents.every((s) => s.isSelected);
    }

    isIndeterminate(): boolean {
        const activeStudents = this.students.filter((s) => !s.isBanned);
        const selectedCount = activeStudents.filter((s) => s.isSelected).length;
        return selectedCount > 0 && selectedCount < activeStudents.length;
    }

    onStudentSelectionChange(): void {
        // Cập nhật trạng thái checkbox "Select All"
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        if (selectAllCheckbox) {
            selectAllCheckbox.indeterminate = this.isIndeterminate();
        }
    }

    getSelectedStudents(): Student[] {
        return this.students.filter((s) => s.isSelected && !s.isBanned);
    }

    toggleBanStudent(student: Student): void {
        // Simulate API call để toggle ban status
        student.isBanned = !student.isBanned;

        if (student.isBanned) {
            // Thêm vào danh sách banned
            const bannedStudent: BannedStudent = {
                username: student.username,
                fullname: student.fullname,
                reason: 'Vi phạm quy định',
                details: 'Ban trực tiếp từ danh sách sinh viên',
                bannedBy: 'Admin',
                bannedDate: new Date().toISOString().split('T')[0],
            };
            this.bannedStudents.push(bannedStudent);
            student.isSelected = false; // Bỏ select khi ban
        } else {
            // Xóa khỏi danh sách banned
            this.bannedStudents = this.bannedStudents.filter((b) => b.username !== student.username);
        }
    }

    confirmBulkBan(): void {
        if (!this.banData.reason || !this.banData.details) {
            return;
        }

        const selectedStudents = this.getSelectedStudents();
        const currentDate = new Date().toISOString().split('T')[0];

        // Cập nhật trạng thái ban cho các sinh viên đã chọn
        selectedStudents.forEach((student) => {
            student.isBanned = true;
            student.isSelected = false;

            // Thêm vào danh sách banned
            const bannedStudent: BannedStudent = {
                username: student.username,
                fullname: student.fullname,
                reason: this.banData.reason,
                details: this.banData.details,
                bannedBy: 'Admin',
                bannedDate: currentDate,
            };
            this.bannedStudents.push(bannedStudent);
        });

        // Đóng modal
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('bulkBanModal'));
        modal.hide();

        // Reset form
        this.banData = { reason: '', details: '' };

        console.log(`Đã ban ${selectedStudents.length} sinh viên`);
    }
}
