import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseFilter, CourseForm, CourseResponse } from '../../../core/models/api/course.model';
import { CourseService } from '../../../core/services/api/course.service';
import { Page } from '../../../core/models/types/page.interface';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'admin-course-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './course.component.html',
    styleUrl: './course.component.scss',
})
export class AdminCoursePage implements OnInit {
    getEndIndex() {
        const startIndex = this.courses.currentPage * this.courses.pageSize;
        return Math.min(startIndex + this.courses.pageSize, this.courses.pageSize * this.courses.totalPages);
    }

    courses: Page<CourseResponse> = {
        content: [],
        totalPages: 0,
        pageSize: 20,
        currentPage: 0,
    };

    filter: CourseFilter = {
        name: '',
        page: 0,
        pageSize: 20,
    };

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

    constructor(
        private readonly router: Router,
        private readonly courseService: CourseService,
        private toastService: ToastService,
    ) {}

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses(page: number = 0) {
        this.isLoading = true;

        this.courseService.getCourses(this.filter).subscribe({
            next: (courses) => {
                this.courses = courses;
                this.filter.page = this.courses.currentPage;
                this.filter.pageSize = this.courses.pageSize;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error loading courses:', error);
                this.toastService.show('Lỗi khi tải danh sách khóa học', 'error');
                this.isLoading = false;
            },
        });
    }

    onPageChange(page: number) {
        if (page >= 0 && page < this.courses.totalPages && !this.isLoading) {
            this.loadCourses(page);
        }
    }

    getDisplayPages(): number[] {
        const pages: number[] = [];
        const current = this.courses.currentPage;
        const total = this.courses.totalPages;

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

    disableButton(): boolean {
        return (
            this.currentCourseForm.name.trim() === '' ||
            this.currentCourseForm.shortDescription.trim() === '' ||
            this.currentCourseForm.sessions < 1 ||
            this.currentCourseForm.sessions > 20 ||
            this.isLoading
        );
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
        if (this.disableButton()) {
            this.toastService.show('Vui lòng điền đầy đủ thông tin khóa học', 'warning');
            return;
        }

        // Simulate API call
        this.isLoading = true;
        this.courseService.save(this.currentCourseForm).subscribe({
            next: (course) => {
                this.isLoading = false;
                this.toastService.show(
                    this.isEditMode ? 'Cập nhật khóa học thành công' : 'Thêm khóa học thành công',
                    'success',
                );
                if (!this.isEditMode) {
                    this.courses.content.unshift(course);
                } else {
                    const index = this.courses.content.findIndex((c) => c.id === course.id);
                    if (index !== -1) {
                        this.courses.content[index] = course;
                    }
                }
                this.closeModal();
            },
            error: (error) => {
                console.error('Error saving course:', error);
                this.isLoading = false;
                this.toastService.show('Lỗi khi lưu khóa học', 'error');
                this.closeModal();
            },
        });
    }

    deleteCourse() {
        if (!this.courseToDelete) return;

        // Simulate API call
        this.isLoading = true;
        this.courseService.deleteById(this.courseToDelete.id).subscribe({
            next: () => {
                this.toastService.show('Xóa khóa học thành công', 'success');
                this.courses.content = this.courses.content.filter((c) => c.id !== this.courseToDelete?.id);
                this.closeDeleteModal();
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error deleting course:', error);
                this.toastService.show('Lỗi khi xóa khóa học', 'error');
                this.closeDeleteModal();
                this.isLoading = false;
            },
        });
    }

    // Navigation
    viewClasses(courseId: string) {
        this.router.navigate(['/admin/classes'], { queryParams: { courseId } });
    }
}
