import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SemesterResponse } from '../../../core/models/api/semester.model';

interface SemesterForm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}
@Component({
  selector: 'admin-semester-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './semester.component.html',
  styleUrl: './semester.component.scss'
})
export class AdminSemesterPage {
  semesters: SemesterResponse[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Học kỳ 1 năm 2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-15')
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Học kỳ 2 năm 2024-2025',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-30')
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Học kỳ hè năm 2025',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-08-31')
    }
  ];

  showModal = false;
  isEditMode = false;
  currentSemesterForm: SemesterForm = {
    id: '',
    name: '',
    startDate: '',
    endDate: ''
  };

  openAddModal() {
    this.isEditMode = false;
    this.currentSemesterForm = {
      id: '',
      name: '',
      startDate: '',
      endDate: ''
    };
    this.showModal = true;
  }

  openEditModal(semester: SemesterResponse) {
    this.isEditMode = true;
    this.currentSemesterForm = {
      id: semester.id,
      name: semester.name,
      startDate: this.dateToInputString(semester.startDate),
      endDate: this.dateToInputString(semester.endDate)
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentSemesterForm = {
      id: '',
      name: '',
      startDate: '',
      endDate: ''
    };
  }

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  dateToInputString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTodayString(): string {
    return this.dateToInputString(new Date());
  }

  validateDates(): string | null {
    const startDate = new Date(this.currentSemesterForm.startDate);
    const endDate = new Date(this.currentSemesterForm.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    // Check if start date is valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Vui lòng chọn ngày hợp lệ!';
    }

    // For new semester, start date must be >= today
    if (!this.isEditMode && startDate < today) {
      return 'Thời gian bắt đầu phải từ hôm nay trở đi!';
    }

    // End date must be after start date
    if (endDate <= startDate) {
      return 'Thời gian kết thúc phải sau thời gian bắt đầu!';
    }

    return null;
  }

  saveSemester() {
    // Basic validation
    if (!this.currentSemesterForm.name || 
        !this.currentSemesterForm.startDate || 
        !this.currentSemesterForm.endDate) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Date validation
    const validationError = this.validateDates();
    if (validationError) {
      alert(validationError);
      return;
    }

    const semesterData: SemesterResponse = {
      id: this.currentSemesterForm.id,
      name: this.currentSemesterForm.name,
      startDate: new Date(this.currentSemesterForm.startDate),
      endDate: new Date(this.currentSemesterForm.endDate)
    };

    if (this.isEditMode) {
      // Update existing semester
      const index = this.semesters.findIndex(s => s.id === semesterData.id);
      if (index !== -1) {
        this.semesters[index] = semesterData;
      }
    } else {
      // Add new semester
      semesterData.id = this.generateUUID();
      this.semesters.push(semesterData);
    }

    this.closeModal();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  // Simulate API response mapping - you can use this when integrating with real API
  mapServerResponseToSemester(serverData: any): SemesterResponse {
    return {
      id: serverData.id,
      name: serverData.name,
      startDate: new Date(serverData.startDate),
      endDate: new Date(serverData.endDate)
    };
  }

  // Simulate mapping semester to API request format
  mapSemesterToApiRequest(semester: SemesterResponse): any {
    return {
      id: semester.id,
      name: semester.name,
      startDate: semester.startDate.toISOString(),
      endDate: semester.endDate.toISOString()
    };
  }
}
