import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SemesterResponse, SemesterForm } from '../../../core/models/api/semester.model';
import * as DatetimeUtil from '../../../core/utils/datetime.util';
import { mockSemesters } from '../../../core/utils/mockdata.util';

@Component({
    selector: 'admin-semester-page',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './semester.component.html',
    styleUrl: './semester.component.scss',
})
export class AdminSemesterPage {
    semesters: SemesterResponse[] = mockSemesters;

    showModal = false;
    isEditMode = false;
    currentSemesterForm: SemesterForm = {
        id: '',
        name: '',
        startDate: '',
        endDate: '',
    };

    openAddModal() {
        this.isEditMode = false;
        this.currentSemesterForm = {
            id: '',
            name: '',
            startDate: '',
            endDate: '',
        };
        this.showModal = true;
    }

    openEditModal(semester: SemesterResponse) {
        this.isEditMode = true;
        this.currentSemesterForm = {
            id: semester.id,
            name: semester.name,
            startDate: DatetimeUtil.dateToInputString(semester.startDate),
            endDate: DatetimeUtil.dateToInputString(semester.endDate),
        };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.currentSemesterForm = {
            id: '',
            name: '',
            startDate: '',
            endDate: '',
        };
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

    saveSemester() {
        // Basic validation
        if (
            !this.currentSemesterForm.name ||
            !this.currentSemesterForm.startDate ||
            !this.currentSemesterForm.endDate
        ) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Date validation
        const validationError = this.validateDates(this.isEditMode);
        if (validationError) {
            alert(validationError);
            return;
        }

        const semesterData: SemesterResponse = {
            id: this.currentSemesterForm.id,
            name: this.currentSemesterForm.name,
            startDate: new Date(this.currentSemesterForm.startDate),
            endDate: new Date(this.currentSemesterForm.endDate),
        };
        console.log('Saving semester:', semesterData);

        this.closeModal();
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('vi-VN');
    }
}
