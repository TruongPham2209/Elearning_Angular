import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Semester {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  name: string;
  sessions: number;
  instructor: Instructor;
  semesterId: string;
}

interface CourseForm {
  id: string;
  name: string;
  sessions: number;
  instructorId: string;
  semesterId: string;
}

interface PaginationInfo {
  currentPage: number; // 0-based from server
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

@Component({
  selector: 'admin-course-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class AdminCoursePage implements OnInit {
getEndIndex() {
    const startIndex = this.paginationInfo.currentPage * this.paginationInfo.pageSize;
    return Math.min(startIndex + this.paginationInfo.pageSize, this.paginationInfo.totalItems);
}
  
  // Sample data
  semesters: Semester[] = [
    {
      id: '1',
      name: 'Học kỳ 1 năm 2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-15')
    },
    {
      id: '2',
      name: 'Học kỳ 2 năm 2024-2025',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-06-30')
    },
    {
      id: '3',
      name: 'Học kỳ hè năm 2025',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-08-31')
    }
  ];

  instructors: Instructor[] = [
    { id: 'ins1', name: 'TS. Nguyễn Văn An', email: 'nva@university.edu.vn' },
    { id: 'ins2', name: 'PGS. Trần Thị Bình', email: 'ttb@university.edu.vn' },
    { id: 'ins3', name: 'GS. Lê Văn Cường', email: 'lvc@university.edu.vn' },
    { id: 'ins4', name: 'TS. Phạm Thị Dung', email: 'ptd@university.edu.vn' },
    { id: 'ins5', name: 'ThS. Hoàng Văn Em', email: 'hve@university.edu.vn' },
    { id: 'ins6', name: 'TS. Đặng Thị Phương', email: 'dtp@university.edu.vn' },
    { id: 'ins7', name: 'PGS. Vũ Văn Giang', email: 'vvg@university.edu.vn' },
    { id: 'ins8', name: 'TS. Ngô Thị Hoa', email: 'nth@university.edu.vn' }
  ];

  courses: Course[] = [];
  filteredInstructors: Instructor[] = [];
  
  // Current state
  selectedSemesterId: string = '';
  isLoading: boolean = false;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  isEditMode: boolean = false;
  
  // Form data
  currentCourseForm: CourseForm = {
    id: '',
    name: '',
    sessions: 1,
    instructorId: '',
    semesterId: ''
  };
  
  courseToDelete: Course | null = null;
  instructorSearchTerm: string = '';
  selectedInstructor: Instructor | null = null;
  
  // Pagination
  paginationInfo: PaginationInfo = {
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 20
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectedSemesterId = this.semesters[0]?.id || '';
    this.loadCourses();
  }

  // Generate sample courses for demonstration
  generateSampleCourses(): Course[] {
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
      'DevOps và CI/CD',
      'Cloud Computing',
      'Data Science',
      'Blockchain Technology',
      'IoT Development',
      'Game Development',
      'UI/UX Design',
      'Software Testing',
      'Microservices Architecture',
      'React.js Advanced',
      'Angular Development',
      'Node.js Backend',
      'Spring Boot',
      'Docker & Kubernetes',
      'Agile Methodology',
      'Digital Marketing',
      'E-commerce Development',
      'API Design',
      'GraphQL',
      'MongoDB',
      'PostgreSQL Advanced',
      'Redis Caching',
      'Elasticsearch',
      'System Design',
      'Performance Optimization',
      'Clean Code Practices',
      'Design Patterns',
      'Software Architecture',
      'Code Review Best Practices',
      'Git Advanced',
      'Jenkins CI/CD',
      'AWS Cloud Services',
      'Azure Fundamentals',
      'Google Cloud Platform'
    ];

    const sampleCourses: Course[] = [];
    
    for (let i = 0; i < 150; i++) {
      const instructor = this.instructors[Math.floor(Math.random() * this.instructors.length)];
      const semesterId = this.semesters[Math.floor(Math.random() * this.semesters.length)].id;
      
      sampleCourses.push({
        id: `course_${i + 1}`,
        name: courseNames[i % courseNames.length] + (i >= courseNames.length ? ` (Lớp ${Math.floor(i / courseNames.length) + 1})` : ''),
        sessions: Math.floor(Math.random() * 20) + 1,
        instructor: instructor,
        semesterId: semesterId
      });
    }
    
    return sampleCourses;
  }

  loadCourses(page: number = 0) {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      const allCourses = this.generateSampleCourses();
      const semesterCourses = allCourses.filter(course => course.semesterId === this.selectedSemesterId);
      
      const startIndex = page * this.paginationInfo.pageSize;
      const endIndex = startIndex + this.paginationInfo.pageSize;
      
      this.courses = semesterCourses.slice(startIndex, endIndex);
      
      this.paginationInfo = {
        currentPage: page,
        totalPages: Math.ceil(semesterCourses.length / this.paginationInfo.pageSize),
        totalItems: semesterCourses.length,
        pageSize: this.paginationInfo.pageSize
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
      instructorId: '',
      semesterId: this.selectedSemesterId
    };
    this.selectedInstructor = null;
    this.instructorSearchTerm = '';
    this.filteredInstructors = [];
    this.showModal = true;
  }

  openEditModal(course: Course) {
    this.isEditMode = true;
    this.currentCourseForm = {
      id: course.id,
      name: course.name,
      sessions: course.sessions,
      instructorId: course.instructor.id,
      semesterId: course.semesterId
    };
    this.selectedInstructor = course.instructor;
    this.instructorSearchTerm = '';
    this.filteredInstructors = [];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  openDeleteModal(course: Course) {
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
      instructorId: '',
      semesterId: ''
    };
    this.selectedInstructor = null;
    this.instructorSearchTerm = '';
    this.filteredInstructors = [];
  }

  // Instructor search functions
  onInstructorSearch() {
    if (this.instructorSearchTerm.trim()) {
      this.filteredInstructors = this.instructors.filter(instructor =>
        instructor.name.toLowerCase().includes(this.instructorSearchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(this.instructorSearchTerm.toLowerCase())
      );
    } else {
      this.filteredInstructors = [];
    }
  }

  selectInstructor(instructor: Instructor) {
    this.selectedInstructor = instructor;
    this.currentCourseForm.instructorId = instructor.id;
    this.instructorSearchTerm = '';
    this.filteredInstructors = [];
  }

  clearSelectedInstructor() {
    this.selectedInstructor = null;
    this.currentCourseForm.instructorId = '';
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

    if (!this.currentCourseForm.instructorId) {
      alert('Vui lòng chọn giảng viên!');
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}