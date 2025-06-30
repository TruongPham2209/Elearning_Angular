import { bannedCauseOptions } from './../../../core/models/types/navigator.interface';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassResponse } from '../../../core/models/api/class.model';
import { mockBannedStudents, mockClasses, mockStudents } from '../../../core/utils/mockdata.util';
import { BannedStudentResponse, BanStudentRequest, StudentResponse } from '../../../core/models/api/student.model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BannedCause } from '../../../core/models/enum/banned_cause.model';

@Component({
    selector: 'manage-student-page',
    imports: [CommonModule, FormsModule, RouterModule, NgbModule],
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss',
})
export class ManageStudentPage implements OnInit {
    banStudentModalReference: any;

    classId: string = '';
    currentClass: ClassResponse | null = null;
    activeTab: 'students' | 'banned' = 'students';
    isLoading: boolean = false;

    students: StudentResponse[] = [];
    bannedStudents: BannedStudentResponse[] = [];
    banData: BanStudentRequest = {
        classId: '',
        students: [],
        cause: BannedCause.CHEAT,
        description: '',
    };
    bannedCauseOptions = bannedCauseOptions;

    private mockClasses: ClassResponse[] = mockClasses;
    private mockStudents: StudentResponse[] = mockStudents;
    private mockBannedStudents: BannedStudentResponse[] = mockBannedStudents;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
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
        const selectAllCheckbox = document.getElementById('selectAll') as HTMLInputElement;
        if (selectAllCheckbox) {
            selectAllCheckbox.indeterminate = this.isIndeterminate();
        }
    }

    getSelectedStudents(): StudentResponse[] {
        return this.students.filter((s) => s.isSelected && !s.isBanned);
    }

    disableBanButton(): boolean {
        return !this.banData.cause || this.banData.description.trim() === '' || this.getSelectedStudents().length === 0;
    }

    openBulkBanModal(content: any): void {
        this.banStudentModalReference = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    toggleBanStudent(student: StudentResponse): void {
        // Simulate API call để toggle ban status
        student.isBanned = !student.isBanned;

        if (!student.isBanned) {
            this.bannedStudents = this.bannedStudents.filter((b) => b.code !== student.username);
            return;
        }

        // Thêm vào danh sách banned
        const bannedStudent: BannedStudentResponse = {
            code: student.username,
            fullname: student.fullname,
            cause: BannedCause.OTHER,
            mail: student.email,
            description: 'Ban trực tiếp từ danh sách sinh viên',
            bannedBy: 'Admin',
            bannedDate: new Date(),
        };
        this.bannedStudents.push(bannedStudent);
        student.isSelected = false;
    }

    confirmBulkBan(): void {
        if (this.banData.description.trim() === '') {
            return;
        }

        const selectedStudents: string[] = this.getSelectedStudents().map((s) => s.username);
        if (selectedStudents.length === 0) {
            return;
        }
        this.banData.students = selectedStudents;
        this.banData.description = this.banData.description.trim();
        console.log(
            `Xác nhận ban ${selectedStudents.length} sinh viên với nguyên nhân: ${this.banData.cause}, mô tả: ${this.banData.description}`,
        );

        // Đóng modal
        if (this.banStudentModalReference) {
            this.banStudentModalReference.close();
        }

        // Reset form
        this.banData = { cause: BannedCause.OTHER, description: '', classId: this.classId, students: [] };
        console.log(`Đã ban ${selectedStudents.length} sinh viên`);

        // Bỏ chọn tất cả checkbox
        this.students.forEach((student) => (student.isSelected = false));
    }

    private loadClassData(): void {
        this.currentClass = this.mockClasses.find((cls) => cls.id === this.classId) || null;
        this.banData.classId = this.classId;

        if (!this.currentClass) {
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
}
