import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SemesterResponse } from '../../../core/models/api/semester.model';
import { UserResponse } from '../../../core/models/api/user.model';
import { ClassResponse } from '../../../core/models/api/class.model';

// Interface cho Class data

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
    classes: ClassResponse[] = [];
    classToDelete: ClassResponse | null = null;
    selectedFile: File | null = null;

    semesters: SemesterResponse[] = [
        {
            id: '1',
            name: 'Học kỳ 1 năm 2024-2025',
            startDate: new Date('2024-09-01'),
            endDate: new Date('2025-01-15'),
        },
        {
            id: '2',
            name: 'Học kỳ 2 năm 2024-2025',
            startDate: new Date('2025-02-01'),
            endDate: new Date('2025-06-30'),
        },
        {
            id: '3',
            name: 'Học kỳ hè năm 2025',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-08-31'),
        },
    ];

    shifts = [
        { title: 'Ca 1 (7:00 - 9:00)', value: 1 },
        { title: 'Ca 2 (9:30 - 11:30)', value: 2 },
        { title: 'Ca 3 (13:00 - 15:00)', value: 3 },
        { title: 'Ca 4 (15:30 - 17:30)', value: 4 },
        { title: 'Ca 5 (18:00 - 20:00)', value: 5 },
    ];

    weekDays = [
        { value: 0, label: 'Thứ 2' },
        { value: 1, label: 'Thứ 3' },
        { value: 2, label: 'Thứ 4' },
        { value: 3, label: 'Thứ 5' },
        { value: 4, label: 'Thứ 6' },
        { value: 5, label: 'Thứ 7' },
        { value: 6, label: 'Chủ nhật' },
    ];

    onDaySelectionChange(event: any) {
        const dayValue = +event.target.value;
        if (event.target.checked) {
            // Thêm nếu được chọn
            if (!this.newClass.daysInWeek.includes(dayValue)) {
                this.newClass.daysInWeek.push(dayValue);
            }
        } else {
            // Bỏ nếu bỏ chọn
            this.newClass.daysInWeek = this.newClass.daysInWeek.filter((day) => day !== dayValue);
        }
    }

    instructors: UserResponse[] = [
        { id: 'ins1', fullName: 'TS. Nguyễn Văn An', email: 'nva@university.edu.vn' },
        { id: 'ins2', fullName: 'PGS. Trần Thị Bình', email: 'ttb@university.edu.vn' },
        { id: 'ins3', fullName: 'GS. Lê Văn Cường', email: 'lvc@university.edu.vn' },
        { id: 'ins4', fullName: 'TS. Phạm Thị Dung', email: 'ptd@university.edu.vn' },
        { id: 'ins5', fullName: 'ThS. Hoàng Văn Em', email: 'hve@university.edu.vn' },
        { id: 'ins6', fullName: 'TS. Đặng Thị Phương', email: 'dtp@university.edu.vn' },
        { id: 'ins7', fullName: 'PGS. Vũ Văn Giang', email: 'vvg@university.edu.vn' },
        { id: 'ins8', fullName: 'TS. Ngô Thị Hoa', email: 'nth@university.edu.vn' },
    ];

    newClass = {
        name: '',
        schedule: '',
        semesterId: '',
        lecturerId: '',
        daysInWeek: [] as number[],
    };

    selectedSemesterId: string = '';
    instructorSearchTerm: string = '';
    selectedInstructor: UserResponse | null = null;
    filteredInstructors: UserResponse[] = [];

    // Mock data cho courses
    private mockCourses: CourseData[] = [
        { id: '1', name: 'Lập trình Web Frontend' },
        { id: '2', name: 'Lập trình Mobile React Native' },
        { id: '3', name: 'Thiết kế UI/UX' },
    ];

    // Mock data cho classes
    private mockClasses: ClassResponse[] = [
        {
            id: '1',
            name: 'Frontend-K1',
            room: 'Phòng 101',
            schedule: 'Sáng (7:30-11:30)',
            lecturerId: 'ins1',
            lecturerName: 'TS. Nguyễn Văn An',
            lecturerEmail: 'nguyen@gmail.com',
        },
        {
            id: '2',
            name: 'Frontend-K2',
            room: 'Phòng 102',
            schedule: 'Chiều (13:30-17:30)',
            lecturerId: 'ins2',
            lecturerName: 'PGS. Trần Thị Bình',
            lecturerEmail: 'binh@gmail.com',
        },
        {
            id: '3',
            name: 'Mobile-K1',
            room: 'Phòng 201',
            schedule: 'Tối (18:30-21:30)',
            lecturerId: 'ins3',
            lecturerName: 'GS. Lê Văn Cường',
            lecturerEmail: 'cuong@gmail.com',
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
        this.classes = this.mockClasses;
    }

    viewStudents(classId: string): void {
        console.log('Navigating to students of class with ID:', classId);
        this.router.navigate(['/admin/classes/students'], {
            queryParams: { classId: classId },
        });
    }

    confirmDelete(classData: ClassResponse): void {
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
        const newClassData: ClassResponse = {
            id: (this.classes.length + 1).toString(),
            name: this.newClass.name,
            schedule: this.newClass.schedule,
            room: 'Phòng ' + (this.classes.length + 1), // Tự động gán phòng
            lecturerId: this.selectedInstructor ? this.selectedInstructor.id : '',
            lecturerName: this.selectedInstructor ? this.selectedInstructor.fullName : '',
            lecturerEmail: this.selectedInstructor ? this.selectedInstructor.email : '',
        };

        this.classes.push(newClassData);

        // Đóng modal
        const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('createClassModal'));
        modal.hide();

        // Reset form
        this.newClass = { name: '', schedule: '', semesterId: '', lecturerId: '', daysInWeek: [] };
        this.selectedFile = null;

        // Reset file input
        const fileInput = document.getElementById('studentFile') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        // Có thể thêm toast notification ở đây
        console.log('Đã tạo lớp mới thành công', { newClass: newClassData, file: this.selectedFile });
    }

    // Instructor search functions
    onInstructorSearch() {
        if (this.instructorSearchTerm.trim()) {
            this.filteredInstructors = this.instructors.filter(
                (instructor) =>
                    instructor.fullName.toLowerCase().includes(this.instructorSearchTerm.toLowerCase()) ||
                    instructor.email.toLowerCase().includes(this.instructorSearchTerm.toLowerCase()),
            );
        } else {
            this.filteredInstructors = [];
        }
    }

    selectInstructor(instructor: UserResponse) {
        this.selectedInstructor = instructor;
        // this.currentCourseForm. = instructor.id;
        this.instructorSearchTerm = '';
        this.filteredInstructors = [];
    }

    clearSelectedInstructor() {
        this.selectedInstructor = null;
        // this.currentCourseForm.teacherId = '';
    }
}
