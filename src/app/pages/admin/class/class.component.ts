import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ClassForm, ClassResponse } from '../../../core/models/api/class.model';
import { CourseResponse } from '../../../core/models/api/course.model';
import { SemesterResponse } from '../../../core/models/api/semester.model';
import { UserFilter, UserResponse } from '../../../core/models/api/user.model';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { ClassService } from '../../../core/services/api/class.service';
import { CourseService } from '../../../core/services/api/course.service';
import { UserService } from '../../../core/services/api/user.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import * as FileUtil from '../../../core/utils/file.util';
import { SemesterService } from './../../../core/services/api/semester.service';

@Component({
    selector: 'admin-class-page',
    imports: [CommonModule, FormsModule, NgbModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class AdminClassPage implements OnInit {
    private searchSubject = new Subject<string>();
    createModalReference: any;
    deleteModalReference: any;

    isLoading: boolean = false;
    isCreating: boolean = false;
    isDeleting: boolean = false;
    isImporting: boolean = false;

    currentCourse: CourseResponse | null = null;
    classToDelete: ClassResponse | null = null;
    selectedFile: File | null = null;

    selectedSemesterId: string = '';
    instructorSearchTerm: string = '';
    selectedInstructor: UserResponse | null = null;

    classes: ClassResponse[] = [];
    semesters: SemesterResponse[] = [];
    instructors: UserResponse[] = [];

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
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly modalService: NgbModal,
        private readonly userService: UserService,
        private readonly semesterService: SemesterService,
        private readonly classService: ClassService,
        private readonly courseService: CourseService,
        private readonly toastService: ToastService,
    ) {}

    ngOnInit(): void {
        // Lấy courseId từ query params
        this.route.queryParams.subscribe((params) => {
            this.isLoading = true;
            const courseId = params['courseId'];

            if (!courseId) {
                // Nếu không có courseId, redirect về dashboard
                this.router.navigate(['/admin/dashboard']);
                return;
            }

            this.courseService.getById(courseId).subscribe({
                next: (course) => {
                    this.currentCourse = course;
                    this.newClass.courseId = courseId;

                    this.loadSemesters();

                    this.searchSubject
                        .pipe(
                            debounceTime(300), // Đợi 300ms sau lần gõ cuối cùng
                            distinctUntilChanged(), // Chỉ thực hiện nếu giá trị thay đổi
                        )
                        .subscribe((searchTerm) => {
                            this.loadInstructors(searchTerm); // Gọi API tại đây
                        });
                },

                error: (error) => {
                    console.error('Lỗi khi tải thông tin khóa học:', error);
                    this.toastService.show(
                        'Đã xảy ra lỗi khi tải thông tin khóa học. ' + (error.message || ''),
                        'error',
                    );
                    this.router.navigate(['/admin/dashboard']);
                    return;
                },
            });
        });
    }

    // Xử lý sự kiện
    onDaySelectionChange(dayValue: number) {
        const index = this.newClass.daysInWeek.indexOf(dayValue);
        if (index > -1) {
            // Nếu đã chọn -> Bỏ chọn
            this.newClass.daysInWeek.splice(index, 1);
        } else {
            // Nếu chưa chọn -> Thêm vào
            this.newClass.daysInWeek.push(dayValue);
        }
    }

    onSemesterChange() {
        this.isLoading = true;
        console.log('Selected semester ID:', this.selectedSemesterId);

        this.loadClasses();
    }

    viewStudents(classId: string): void {
        console.log('Navigating to students of class with ID:', classId);
        this.router.navigate(['/admin/classes/students'], {
            queryParams: { classId: classId },
        });
    }

    disableCreateButton(): boolean {
        return (
            this.newClass.name.trim() === '' ||
            this.newClass.room.trim() === '' ||
            this.newClass.shift < 1 ||
            this.newClass.shift > 5 ||
            this.newClass.semesterId.trim() === '' ||
            !this.selectedInstructor ||
            this.newClass.daysInWeek.length === 0 ||
            !this.selectedFile ||
            this.isCreating ||
            this.isImporting ||
            !this.selectInstructor
        );
    }

    async onFileSelected(event: any) {
        if (this.isImporting) {
            this.toastService.show('Đang xử lý tệp. Vui lòng đợi.', 'warning');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        if (file.size === 0) {
            this.toastService.show('File rỗng. Vui lòng chọn file khác.', 'warning');
            event.target.value = '';
            return;
        }

        // Validate file type
        if (!file.type.includes('spreadsheet') && !file.name.match(/\.(xlsx|xls)$/)) {
            this.toastService.show('Vui lòng chọn file Excel hợp lệ (.xlsx, .xls)', 'warning');
            event.target.value = '';
            return;
        }

        this.selectedFile = file;
        this.isImporting = true;
        await FileUtil.parseExcelFileToStudentCose(file)
            .then((studentCodes) => {
                this.newClass.studentCodes = studentCodes;
                this.isImporting = false;
                this.toastService.show('Đã tải tệp thành công. Bạn có thể tạo lớp học ngay bây giờ.', 'success');
            })
            .catch((error) => {
                this.selectedFile = null;
                this.newClass.studentCodes = [];
                event.target.value = '';
                this.isImporting = false;
                this.toastService.show(
                    'Đã xảy ra lỗi khi phân tích tệp. Vui lòng thử lại.' + (error.message || ''),
                    'error',
                );
            });
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // xử lý modal
    setClassToDelete(classData: ClassResponse, content: TemplateRef<any>): void {
        this.classToDelete = classData;
        this.deleteModalReference = this.modalService.open(content, { centered: true });
    }

    deleteClass(): void {
        if (this.isDeleting || !this.classToDelete) {
            return;
        }

        this.classService.deleteById(this.classToDelete.id).subscribe({
            next: () => {
                this.toastService.show('Lớp học đã được xóa thành công.', 'success');
                this.classes = this.classes.filter((cls) => cls.id !== this.classToDelete?.id);
                this.closeDeleteModal();
            },
            error: (error) => {
                this.toastService.show('Đã xảy ra lỗi khi xóa lớp học. ' + (error.message || ''), 'error');
                this.closeDeleteModal();
            },
        });
    }

    private closeDeleteModal(): void {
        this.classToDelete = null;
        this.deleteModalReference?.close();
        this.isDeleting = false;
    }

    openCreateClassModal(content: TemplateRef<any>): void {
        this.resetFormFields();
        this.createModalReference = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    createClass(): void {
        if (this.disableCreateButton()) {
            this.toastService.show('Vui lòng điền đầy đủ thông tin lớp học và chọn tệp Excel.', 'warning');
            return;
        }

        if (this.isCreating) {
            this.toastService.show('Đang tạo lớp học. Vui lòng đợi.', 'warning');
            return;
        }

        console.log('Selecting instructor:', this.selectedInstructor);
        this.newClass.lecturerId = this.selectedInstructor?.id || '';
        this.isCreating = true;
        this.classService.createClass(this.newClass).subscribe({
            next: () => {
                this.toastService.show('Lớp học đã được tạo thành công.', 'success');
                this.resetFormAndCloseModal();
            },
            error: (error) => {
                this.resetFormAndCloseModal();
                this.toastService.show('Đã xảy ra lỗi khi tạo lớp học. ' + (error.message || ''), 'error');
            },
        });
    }

    // Tìm kiếm giảng viên
    onInstructorSearch(): void {
        this.searchSubject.next(this.instructorSearchTerm);
    }

    selectInstructor(instructor: UserResponse): void {
        this.selectedInstructor = instructor;
        this.instructorSearchTerm = '';
        this.instructors = [];

        console.log('Selected instructor:', this.selectedInstructor);
    }

    clearSelectedInstructor(): void {
        this.selectedInstructor = null;
    }

    // Fetching data
    private loadClasses(): void {
        this.classService.getClassesByFilter(this.newClass.courseId, this.selectedSemesterId).subscribe({
            next: (classes) => {
                this.classes = classes;
                this.isLoading = false;
            },
            error: (error) => {
                this.toastService.show('Đã xảy ra lỗi khi tải danh sách lớp học. ' + (error.message || ''), 'error');
                this.isLoading = false;
            },
        });
    }

    private loadSemesters(): void {
        this.semesterService.getAll().subscribe({
            next: (semesters) => {
                this.semesters = semesters;
                if (this.semesters.length > 0) {
                    this.selectedSemesterId = this.semesters[0].id;
                }
                this.loadClasses();
            },
            error: (error) => {
                this.toastService.show('Đã xảy ra lỗi khi tải danh sách học kỳ. ' + (error.message || ''), 'error');
            },
        });
    }

    private loadInstructors(searchTerm: string) {
        const filter: UserFilter = {
            role: ManagerRole.LECTURER,
            search: searchTerm,
            page: 0,
            pageSize: 5,
        };
        this.userService.getAll(filter).subscribe({
            next: (instructors) => {
                this.instructors = instructors.contents || [];
            },
            error: (error) => {
                this.toastService.show('Đã xảy ra lỗi khi tải danh sách giảng viên. ' + (error.message || ''), 'error');
            },
        });
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
            courseId: this.newClass.courseId,
            room: '',
        };
        this.selectedFile = null;
        this.selectedInstructor = null;
        this.instructorSearchTerm = '';
        this.instructors = [];

        this.isCreating = false;
    }
}
