import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClassResponse } from '../../../core/models/api/class.model';
import { BannedStudentResponse, BanStudentRequest, StudentResponse } from '../../../core/models/api/student.model';
import { BannedCause } from '../../../core/models/enum/banned_cause.model';
import { ClassService } from '../../../core/services/api/class.service';
import { LoggingService } from '../../../core/services/api/logging.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { bannedCauseOptions } from './../../../core/models/types/navigator.interface';

@Component({
    selector: 'manage-student-page',
    imports: [CommonModule, FormsModule, RouterModule, NgbModule],
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss',
})
export class ManageStudentPage implements OnInit {
    banStudentModalReference: any;
    unbanStudentModalReference: any;

    classId: string = '';
    currentClass: ClassResponse | null = null;
    activeTab: 'students' | 'banned' = 'students';

    // loading state
    isLoadingStudent: boolean = false;
    isLoadingBannedStudents: boolean = false;
    isBulkingBan: boolean = false;
    isUnlocking: boolean = false;

    students: StudentResponse[] = [];
    bannedStudents: BannedStudentResponse[] = [];
    bannedStudentSelected: BannedStudentResponse | null = null;
    banData: BanStudentRequest = {
        classId: '',
        studentCodes: [],
        cause: BannedCause.CHEAT,
        description: '',
    };
    bannedCauseOptions = bannedCauseOptions;

    constructor(
        private readonly router: Router,
        private readonly modalService: NgbModal,
        private readonly route: ActivatedRoute,
        private readonly toastService: ToastService,
        private readonly classService: ClassService,
        private readonly loggingService: LoggingService,
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.classId = params['classId'];

            if (!this.classId) {
                this.toastService.show('Không tìm thấy lớp học. Vui lòng chọn lại.', 'error');
                this.router.navigate(['/admin/dashboard']);
                return;
            }

            this.loadClassData();
        });
    }

    switchTab(tab: 'students' | 'banned'): void {
        if (this.activeTab === tab) return;
        this.activeTab = tab;
    }

    toggleSelectAll(event: any): void {
        const isSelected = event.target.checked;
        this.students.forEach((student) => {
            if (!student.banned) {
                student.isSelected = isSelected;
            }
        });
    }

    isAllSelected(): boolean {
        const activeStudents = this.students.filter((s) => !s.banned);
        return activeStudents.length > 0 && activeStudents.every((s) => s.isSelected);
    }

    isIndeterminate(): boolean {
        const activeStudents = this.students.filter((s) => !s.banned);
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
        return this.students.filter((s) => s.isSelected && !s.banned);
    }

    disableBanButton(): boolean {
        return (
            !this.banData.cause ||
            this.banData.description.trim() === '' ||
            this.getSelectedStudents().length === 0 ||
            this.isBulkingBan
        );
    }

    openBulkBanModal(content: any): void {
        this.banStudentModalReference = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    confirmBulkBan(): void {
        if (this.banData.description.trim() === '') {
            return;
        }

        if (this.isBulkingBan) {
            this.toastService.show('Đang xử lý yêu cầu ban, vui lòng đợi trong giây lát.', 'info');
            return;
        }

        const selectedStudents: string[] = this.getSelectedStudents().map((s) => s.code);
        if (selectedStudents.length === 0) {
            return;
        }
        this.banData.studentCodes = selectedStudents;
        this.banData.description = this.banData.description.trim();
        this.isBulkingBan = true;
        this.classService.banStudents(this.banData).subscribe({
            next: () => {
                this.toastService.show(`Đã ban ${selectedStudents.length} sinh viên thành công.`, 'success');
                this.loadStudents();
                this.loadBannedStudents();
                this.resetBanData();
            },
            error: (error) => {
                this.toastService.show(
                    'Không thể ban sinh viên. Vui lòng thử lại sau.' + (error.message || ''),
                    'error',
                );
                this.resetBanData();
            },
        });
    }

    openUnbanStudentModal(content: any, student: BannedStudentResponse): void {
        this.unbanStudentModalReference = this.modalService.open(content, { centered: true });
        this.bannedStudentSelected = student;
    }

    unbanStudent(): void {
        if (this.isUnlocking || !this.bannedStudentSelected) {
            return;
        }

        this.isUnlocking = true;
        const unbanRequest = {
            classId: this.classId,
            studentCode: this.bannedStudentSelected.code,
        };
        this.classService.unbanStudent(unbanRequest).subscribe({
            next: () => {
                this.toastService.show(
                    `Đã mở ban cho sinh viên ${this.bannedStudentSelected?.fullname} thành công.`,
                    'success',
                );
                this.loadStudents();
                this.loadBannedStudents();

                this.closeUnbanModal();
            },
            error: (error) => {
                this.toastService.show(
                    'Không thể mở ban sinh viên. Vui lòng thử lại sau.' + (error.message || ''),
                    'error',
                );
                console.error('Error unbanning student:', error);

                this.closeUnbanModal();
            },
        });
    }

    private closeUnbanModal(): void {
        this.unbanStudentModalReference?.close();
        this.bannedStudentSelected = null;
        this.isUnlocking = false;
    }

    private resetBanData(): void {
        this.isBulkingBan = false;
        this.banStudentModalReference?.close();
        this.banData = { cause: BannedCause.OTHER, description: '', classId: this.classId, studentCodes: [] };
        this.students.forEach((student) => (student.isSelected = false));
    }

    private loadClassData(): void {
        this.classService.getById(this.classId).subscribe({
            next: (classData) => {
                this.currentClass = classData;
                this.loadStudents();
                this.loadBannedStudents();
                this.banData.classId = classData.id;
            },
            error: (error) => {
                this.toastService.show(
                    'Không thể tải thông tin lớp học. Vui lòng thử lại sau.' + (error.message || ''),
                    'error',
                );
            },
        });
    }

    private loadStudents(): void {
        if (this.isLoadingStudent) return;

        this.isLoadingStudent = true;
        this.classService.getStudentsInClass(this.classId).subscribe({
            next: (students) => {
                this.students = students.map((student) => ({
                    ...student,
                    isSelected: false,
                }));
                this.isLoadingStudent = false;
            },
            error: (error) => {
                this.toastService.show(
                    'Không thể tải danh sách sinh viên. Vui lòng thử lại sau.' + (error.message || ''),
                    'error',
                );
                this.isLoadingStudent = false;
            },
        });
    }

    private loadBannedStudents(): void {
        if (this.isLoadingBannedStudents) return;

        this.isLoadingBannedStudents = true;
        this.loggingService.getBanned(this.classId).subscribe({
            next: (bannedStudents) => {
                this.bannedStudents = bannedStudents;
                this.isLoadingBannedStudents = false;
            },
            error: (error) => {
                this.toastService.show(
                    'Không thể tải danh sách sinh viên đã bị ban. Vui lòng thử lại sau.' + (error.message || ''),
                    'error',
                );
                this.isLoadingBannedStudents = false;
            },
        });
    }
}
