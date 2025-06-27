import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SemesterResponse } from '../../../core/models/api/semester.model';
import { UserResponse } from '../../../core/models/api/user.model';
import { ClassForm, ClassResponse } from '../../../core/models/api/class.model';
import { CourseResponse } from '../../../core/models/api/course.model';
import { mockClasses, mockCourses, mockSemesters, mockUsers } from '../../../core/utils/mockdata.util';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'admin-class-page',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class AdminClassPage implements OnInit {
    createModalReference: any;
    deleteModalReference: any;

    courseId: string = '';
    currentCourse: CourseResponse | null = null;
    classes: ClassResponse[] = [];
    classToDelete: ClassResponse | null = null;
    selectedFile: File | null = null;

    selectedSemesterId: string = '';
    instructorSearchTerm: string = '';
    selectedInstructor: UserResponse | null = null;
    filteredInstructors: UserResponse[] = [];

    semesters: SemesterResponse[] = mockSemesters;
    instructors: UserResponse[] = mockUsers;
    mockCourses: CourseResponse[] = mockCourses;
    private mockClasses: ClassResponse[] = mockClasses;

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

    newClass: ClassForm = {
        courseId: '',
        semesterId: '',
        lecturerId: '',

        name: '',
        room: '',

        shift: 1,
        daysInWeek: [] as number[],
        studentCodes: [],
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
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

    // Xử lý sự kiện
    onDaySelectionChange(event: any) {
        const dayValue = +event.target.value;
        if (!event.target.checked) {
            this.newClass.daysInWeek = this.newClass.daysInWeek.filter((day) => day !== dayValue);
            return;
        }
        // Thêm nếu được chọn
        if (!this.newClass.daysInWeek.includes(dayValue)) {
            this.newClass.daysInWeek.push(dayValue);
        }
    }

    viewStudents(classId: string): void {
        console.log('Navigating to students of class with ID:', classId);
        this.router.navigate(['/admin/classes/students'], {
            queryParams: { classId: classId },
        });
    }

    disableCreateButton(): boolean {
        console.log('Name trimmed:', this.newClass.name.trim(), ' Room trimmed:', this.newClass.room.trim());
        console.log('Name is empty:', this.newClass.name.trim() === '');
        console.log('File selected:', this.selectedFile !== null);

        return (
            this.newClass.name.trim() === '' ||
            this.newClass.room.trim() === '' ||
            this.newClass.shift < 1 ||
            this.newClass.shift > 5 ||
            this.newClass.semesterId.trim() === '' ||
            !this.selectedInstructor ||
            this.newClass.daysInWeek.length === 0
            //  || !this.selectedFile
            //|| this.newClass.studentCodes.length === 0
        );
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        // Chỉ chọn file excel
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
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

    // xử lý modal
    openCreateClassModal(content: TemplateRef<any>): void {
        this.resetFormFields();
        this.createModalReference = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    setClassToDelete(classData: ClassResponse, content: TemplateRef<any>): void {
        this.classToDelete = classData;
        this.deleteModalReference = this.modalService.open(content, { centered: true });
    }

    deleteClass(): void {
        if (this.classToDelete) {
            this.classToDelete = null;

            this.deleteModalReference.close();
            console.log('Đã xóa lớp thành công');
        }
    }

    createClass(): void {
        console.log('Disable: ', this.disableCreateButton());

        this.newClass.lecturerId = this.selectedInstructor?.id || '';
        console.log('Creating new class with data:', this.newClass);

        this.resetFormAndCloseModal();
    }

    // Tìm kiếm giảng viên
    onInstructorSearch(): void {
        this.filteredInstructors = this.instructors.filter(
            (instructor) =>
                instructor.fullName.toLowerCase().includes(this.instructorSearchTerm.toLowerCase()) ||
                instructor.email.toLowerCase().includes(this.instructorSearchTerm.toLowerCase()),
        );
    }

    selectInstructor(instructor: UserResponse): void {
        this.selectedInstructor = instructor;
        this.instructorSearchTerm = '';
        this.filteredInstructors = [];
    }

    clearSelectedInstructor(): void {
        this.selectedInstructor = null;
    }

    private loadCourseData(): void {
        // Simulate API call để lấy thông tin course
        this.newClass.courseId = this.courseId;
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

    private resetFormAndCloseModal(): void {
        this.resetFormFields();
        if (this.createModalReference) {
            this.createModalReference.close();
        }
    }

    private resetFormFields(): void {
        this.newClass = {
            name: '',
            shift: 1,
            semesterId: '',
            lecturerId: '',
            daysInWeek: [],
            studentCodes: [],
            courseId: this.courseId,
            room: '',
        };
        this.selectedFile = null;
        this.selectedInstructor = null;
        this.instructorSearchTerm = '';
        this.filteredInstructors = [];
    }
}
