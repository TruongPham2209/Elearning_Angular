import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseForm, CourseResponse } from '../../../core/models/api/course.model';

@Component({
    selector: 'admin-course-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './course.component.html',
    styleUrl: './course.component.scss',
})
export class AdminCoursePage implements OnInit {
    getEndIndex() {
        const startIndex = this.paginationInfo.currentPage * this.paginationInfo.pageSize;
        return Math.min(startIndex + this.paginationInfo.pageSize, this.paginationInfo.totalItems);
    }

    courses: CourseResponse[] = [];

    // Current state
    isLoading: boolean = false;
    showModal: boolean = false;
    showDeleteModal: boolean = false;
    isEditMode: boolean = false;
    courseToDelete: CourseResponse | null = null;

    // Form data
    currentCourseForm: CourseForm = {
        id: '',
        name: '',
        sessions: 1,
        shortDescription: '',
    };

    // Pagination
    paginationInfo: any = {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        pageSize: 20,
    };

    constructor(private router: Router) {}

    ngOnInit() {
        this.loadCourses();
    }

    // Generate sample courses for demonstration
    generateSampleCourses(): CourseResponse[] {
        const courseNames = [
            'Lập trình Java nâng cao',
            'Cơ sở dữ liệu Oracle',
            'Phát triển ứng dụng Web',
            'Kỹ thuật phần mềm',
            'Trí tuệ nhân tạo',
            'Machine Learning cơ bản',
            'Phân tích và thiết kế hệ thống',
            'Lập trình Python',
            'Quản lý dự án IT',
            'Bảo mật thông tin',
            'Mạng máy tính',
            'Hệ điều hành Linux',
            'Frontend Development',
            'Backend Development',
            'Mobile App Development',
        ];

        const sampleCourses: CourseResponse[] = [];

        for (let i = 0; i < 150; i++) {
            sampleCourses.push({
                id: `course_${i + 1}`,
                name:
                    courseNames[i % courseNames.length] +
                    (i >= courseNames.length ? ` (Lớp ${Math.floor(i / courseNames.length) + 1})` : ''),
                sessions: Math.floor(Math.random() * 20) + 1,
                shortDescription: `Mô tả ngắn về khóa học ${i + 1}. Đây là một khóa học thú vị và bổ ích.`,
            });
        }

        return sampleCourses;
    }

    loadCourses(page: number = 0) {
        this.isLoading = true;

        // Simulate API call
        setTimeout(() => {
            const allCourses = this.generateSampleCourses();

            const startIndex = page * this.paginationInfo.pageSize;
            const endIndex = startIndex + this.paginationInfo.pageSize;

            this.courses = allCourses.slice(startIndex, endIndex);

            this.paginationInfo = {
                currentPage: page,
                totalPages: Math.ceil(allCourses.length / this.paginationInfo.pageSize),
                totalItems: allCourses.length,
                pageSize: this.paginationInfo.pageSize,
            };

            this.isLoading = false;
        }, 800);
    }

    onSemesterChange() {
        this.paginationInfo.currentPage = 0;
        this.loadCourses(0);
    }

    onPageChange(page: number) {
        if (page >= 0 && page < this.paginationInfo.totalPages) {
            this.loadCourses(page);
        }
    }

    getDisplayPages(): number[] {
        const pages: number[] = [];
        const current = this.paginationInfo.currentPage;
        const total = this.paginationInfo.totalPages;

        if (total <= 7) {
            for (let i = 0; i < total; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 3) {
                pages.push(0, 1, 2, 3, 4, -1, total - 1);
            } else if (current >= total - 4) {
                pages.push(0, -1, total - 5, total - 4, total - 3, total - 2, total - 1);
            } else {
                pages.push(0, -1, current - 1, current, current + 1, -1, total - 1);
            }
        }

        return pages;
    }

    // Modal functions
    openAddModal() {
        this.isEditMode = false;
        this.currentCourseForm = {
            id: '',
            name: '',
            sessions: 1,
            shortDescription: '',
        };
        this.showModal = true;
    }

    openEditModal(course: CourseResponse) {
        this.isEditMode = true;
        this.currentCourseForm = {
            id: course.id,
            name: course.name,
            sessions: course.sessions,
            shortDescription: course.shortDescription,
        };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.resetForm();
    }

    openDeleteModal(course: CourseResponse) {
        this.courseToDelete = course;
        this.showDeleteModal = true;
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.courseToDelete = null;
    }

    resetForm() {
        this.currentCourseForm = {
            id: '',
            name: '',
            sessions: 1,
            shortDescription: '',
        };
    }
    // CRUD operations
    saveCourse() {
        // Validation
        if (!this.currentCourseForm.name.trim()) {
            alert('Vui lòng nhập tên khóa học!');
            return;
        }

        if (this.currentCourseForm.sessions < 1 || this.currentCourseForm.sessions > 20) {
            alert('Số buổi học phải từ 1 đến 20!');
            return;
        }

        // Simulate API call
        this.isLoading = true;
        setTimeout(() => {
            if (this.isEditMode) {
                console.log('Updating course:', this.currentCourseForm);
            } else {
                console.log('Creating course:', this.currentCourseForm);
            }

            this.closeModal();
            this.loadCourses(this.paginationInfo.currentPage);
        }, 500);
    }

    deleteCourse() {
        if (!this.courseToDelete) return;

        // Simulate API call
        this.isLoading = true;
        setTimeout(() => {
            console.log('Deleting course:', this.courseToDelete?.id);
            this.closeDeleteModal();
            this.loadCourses(this.paginationInfo.currentPage);
        }, 500);
    }

    // Navigation
    viewClasses(courseId: string) {
        this.router.navigate(['/admin/classes'], { queryParams: { courseId } });
    }

    generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
