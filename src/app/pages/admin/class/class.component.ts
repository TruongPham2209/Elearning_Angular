import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Interface cho Class data
interface ClassData {
    id: string;
    name: string;
    schedule: string;
    courseId: string;
    studentCount: number;
}

// Interface cho Course data
interface CourseData {
    id: string;
    name: string;
}

@Component({
    selector: 'admin-class-page',
    imports: [CommonModule, FormsModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class AdminClassPage implements OnInit {
    courseId: string = '';
    currentCourse: CourseData | null = null;
    classes: ClassData[] = [];
    classToDelete: ClassData | null = null;
    selectedFile: File | null = null;

    newClass = {
        name: '',
        schedule: '',
    };

    // Mock data cho courses
    private mockCourses: CourseData[] = [
        { id: '1', name: 'Lập trình Web Frontend' },
        { id: '2', name: 'Lập trình Mobile React Native' },
        { id: '3', name: 'Thiết kế UI/UX' },
    ];

    // Mock data cho classes
    private mockClasses: ClassData[] = [
        {
            id: '1',
            name: 'Frontend-K1',
            schedule: 'Sáng (7:30-11:30)',
            courseId: '1',
            studentCount: 25,
        },
        {
            id: '2',
            name: 'Frontend-K2',
            schedule: 'Chiều (13:30-17:30)',
            courseId: '1',
            studentCount: 30,
        },
        {
            id: '3',
            name: 'Mobile-K1',
            schedule: 'Tối (18:30-21:30)',
            courseId: '2',
            studentCount: 20,
        },
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // Lấy courseId từ query params
        this.route.queryParams.subscribe((params) => {
            this.courseId = params['courseId'];

            if (!this.courseId) {
                // Nếu không có courseId, redirect về dashboard
                this.router.navigate(['/admin/dashboard']);
                return;
            }

            this.loadCourseData();
            this.loadClasses();
        });
    }

    private loadCourseData(): void {
        // Simulate API call để lấy thông tin course
        this.currentCourse = this.mockCourses.find((course) => course.id === this.courseId) || null;
        if (!this.currentCourse) {
            console.error('Không tìm thấy course với ID:', this.courseId);
            // Có thể hiển thị thông báo lỗi hoặc redirect về dashboard
            // this.router.navigate(['/admin/dashboard']);
        }
    }

    private loadClasses(): void {
        // Simulate API call để lấy danh sách classes theo courseId
        this.classes = this.mockClasses.filter((cls) => cls.courseId === this.courseId);
    }

    viewStudents(classId: string): void {
        console.log('Navigating to students of class with ID:', classId);
        this.router.navigate(['/admin/classes/students'], {
            queryParams: { classId: classId },
        });
    }

    confirmDelete(classData: ClassData): void {
        this.classToDelete = classData;
        // Sử dụng Bootstrap modal
        const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    deleteClass(): void {
        if (this.classToDelete) {
            // Simulate API call để xóa class
            this.classes = this.classes.filter((cls) => cls.id !== this.classToDelete!.id);

            // Đóng modal
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();

            // Reset
            this.classToDelete = null;

            // Có thể thêm toast notification ở đây
            console.log('Đã xóa lớp thành công');
        }
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    createClass(): void {
        if (!this.newClass.name || !this.newClass.schedule) {
            return;
        }

        // Simulate API call để tạo class mới
        const newClassData: ClassData = {
            id: (this.classes.length + 1).toString(),
            name: this.newClass.name,
            schedule: this.newClass.schedule,
            courseId: this.courseId,
            studentCount: 0, // Sẽ được cập nhật sau khi import file
        };

        this.classes.push(newClassData);

        // Đóng modal
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('createClassModal'));
        modal.hide();

        // Reset form
        this.newClass = { name: '', schedule: '' };
        this.selectedFile = null;

        // Reset file input
        const fileInput = document.getElementById('studentFile') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        // Có thể thêm toast notification ở đây
        console.log('Đã tạo lớp mới thành công', { newClass: newClassData, file: this.selectedFile });
    }
}
