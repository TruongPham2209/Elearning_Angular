import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SemesterForm, SemesterResponse } from '../../../core/models/api/semester.model';
import { SemesterService } from '../../../core/services/api/semester.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import * as DatetimeUtil from '../../../core/utils/datetime.util';

@Component({
    selector: 'admin-semester-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './semester.component.html',
    styleUrl: './semester.component.scss',
})
export class AdminSemesterPage implements OnInit {
    semesters: SemesterResponse[] = [];

    showModal = false;
    isEditMode = false;
    isEditing = false;

    currentSemesterForm: SemesterForm = {
        id: '',
        name: '',
        startDate: new Date(),
        endDate: new Date(),
    };

    constructor(
        private readonly semesterService: SemesterService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.semesterService.getAll().subscribe({
            next: (data) => {
                this.semesters = data;
            },
            error: (error) => {
                console.error('Error fetching semesters:', error);
                this.toastService.show('Không thể tải danh sách học kỳ. Vui lòng thử lại sau.', 'error');
            },
        });
    }

    openAddModal() {
        this.isEditMode = false;
        this.currentSemesterForm = {
            id: '',
            name: '',
            startDate: new Date(),
            endDate: new Date(),
        };
        this.showModal = true;
    }

    openEditModal(semester: SemesterResponse) {
        this.isEditMode = true;
        this.currentSemesterForm = {
            id: semester.id,
            name: semester.name,
            startDate: new Date(),
            endDate: new Date(),
        };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.currentSemesterForm = {
            id: '',
            name: '',
            startDate: new Date(),
            endDate: new Date(),
        };
        this.isEditMode = false;
        this.isEditing = false;
    }

    getTodayString(): string {
        return DatetimeUtil.dateToInputString(new Date());
    }

    validateDates(isUpdate: boolean = false): string | null {
        return DatetimeUtil.validateDates(
            this.currentSemesterForm.startDate,
            this.currentSemesterForm.endDate,
            isUpdate,
        );
    }

    disableSaveButton(): boolean {
        return (
            !this.currentSemesterForm.name ||
            !this.currentSemesterForm.startDate ||
            !this.currentSemesterForm.endDate ||
            this.validateDates(this.isEditMode) !== null
        );
    }

    saveSemester() {
        if (this.disableSaveButton()) {
            this.toastService.show('Vui lòng điền đầy đủ thông tin và kiểm tra lại ngày tháng.', 'warning');
            return;
        }

        if (this.isEditing) {
            this.toastService.show('Đang lưu dữ liệu, vui lòng đợi.', 'info');
            return;
        }

        this.isEditing = true;
        this.currentSemesterForm.id = this.isEditMode ? this.currentSemesterForm.id : '';
        this.semesterService.save(this.currentSemesterForm).subscribe({
            next: (response) => {
                if (this.isEditMode) {
                    const index = this.semesters.findIndex((s) => s.id === this.currentSemesterForm.id);
                    if (index !== -1) {
                        this.semesters[index] = response;
                    }
                } else {
                    this.semesters.push(response);
                }
                this.toastService.show(
                    this.isEditMode ? 'Cập nhật học kỳ thành công.' : 'Thêm học kỳ mới thành công.',
                    'success',
                );
                this.closeModal();
            },
            error: (error) => {
                console.error('Error saving semester:', error);
                this.toastService.show(
                    this.isEditMode ? 'Cập nhật học kỳ thất bại.' : 'Thêm học kỳ mới thất bại.',
                    'error',
                );
                this.closeModal();
            },
        });
    }
}
