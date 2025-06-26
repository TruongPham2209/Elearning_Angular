import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

interface Document {
    id: string;
    lessionId: string;
    title: string;
    content: string;
    createdAt: Date;
    fileId: string;
    fileName: string;
}

interface Assignment {
    id: string;
    lessionId: string;
    title: string;
    content: string;
    deadline: Date;
}

interface Lession {
    id: string;
    name: string;
    documents: Document[];
    assignments: Assignment[];
}

interface CreateAnnouncementDto {
    title: string;
    content: string;
}

interface CreateDocumentDto {
    lessionId: string;
    title: string;
    content: string;
    file: File | null;
}

interface CreateAssignmentDto {
    lessionId: string;
    title: string;
    content: string;
    deadline: string;
}

@Component({
    selector: 'lecturer-class-page',
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class LecturerClassPage implements OnInit {
    lessions: Lession[] = [
        {
            id: '1',
            name: 'Buổi học 1: Giới thiệu khóa học',
            documents: [
                {
                    id: '1',
                    lessionId: '1',
                    title: 'Bài giảng tuần 1',
                    content: 'Nội dung giới thiệu về khóa học và mục tiêu học tập',
                    createdAt: new Date('2024-01-15'),
                    fileId: 'file1',
                    fileName: 'bai-giang-tuan-1.pdf',
                },
            ],
            assignments: [
                {
                    id: '1',
                    lessionId: '1',
                    title: 'Bài tập về nhà tuần 1',
                    content: 'Hoàn thành bài tập trong sách giáo khoa',
                    deadline: new Date('2024-12-30'),
                },
            ],
        },
        {
            id: '2',
            name: 'Buổi học 2: Lý thuyết cơ bản',
            documents: [],
            assignments: [],
        },
    ];

    announcements: Announcement[] = [
        {
            id: '1',
            title: 'Thông báo quan trọng',
            content: 'Lớp học sẽ chuyển sang hình thức online từ tuần tới do tình hình thời tiết.',
            createdAt: new Date('2024-01-10'),
        },
    ];

    // Modal states
    showAnnouncementModal = false;
    showDocumentModal = false;
    showAssignmentModal = false;
    showAnnouncementDetailModal = false;
    assignmentToDelete: Assignment | null = null;
    documentToDelete: Document | null = null;

    // Form data
    newAnnouncement: CreateAnnouncementDto = { title: '', content: '' };
    newDocument: CreateDocumentDto = { lessionId: '', title: '', content: '', file: null };
    newAssignment: CreateAssignmentDto = { lessionId: '', title: '', content: '', deadline: '' };
    selectedAnnouncement: Announcement | null = null;

    // Dropdown states
    expandedLessions: Set<string> = new Set();
    showAnnouncementDropdown = false;

    constructor(private router: Router) {}

    ngOnInit() {}

    // Lession management
    toggleLession(lessionId: string) {
        if (this.expandedLessions.has(lessionId)) {
            this.expandedLessions.delete(lessionId);
        } else {
            this.expandedLessions.add(lessionId);
        }
    }

    isLessionExpanded(lessionId: string): boolean {
        return this.expandedLessions.has(lessionId);
    }

    // Announcement management
    toggleAnnouncementDropdown() {
        this.showAnnouncementDropdown = !this.showAnnouncementDropdown;
    }

    openAnnouncementModal() {
        this.showAnnouncementModal = true;
        this.newAnnouncement = { title: '', content: '' };
    }

    closeAnnouncementModal() {
        this.showAnnouncementModal = false;
    }

    createAnnouncement() {
        if (this.newAnnouncement.title && this.newAnnouncement.content) {
            const announcement: Announcement = {
                id: Date.now().toString(),
                title: this.newAnnouncement.title,
                content: this.newAnnouncement.content,
                createdAt: new Date(),
            };
            this.announcements.unshift(announcement);
            this.closeAnnouncementModal();
        }
    }

    viewAnnouncementDetail(announcement: Announcement) {
        this.selectedAnnouncement = announcement;
        this.showAnnouncementDetailModal = true;
    }

    closeAnnouncementDetailModal() {
        this.showAnnouncementDetailModal = false;
        this.selectedAnnouncement = null;
    }

    // Document management
    openDocumentModal(lessionId: string) {
        this.newDocument = { lessionId, title: '', content: '', file: null };
        this.showDocumentModal = true;
    }

    closeDocumentModal() {
        this.showDocumentModal = false;
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        this.newDocument.file = file;
    }

    createDocument() {
        if (this.newDocument.title && this.newDocument.content && this.newDocument.file) {
            const document: Document = {
                id: Date.now().toString(),
                lessionId: this.newDocument.lessionId,
                title: this.newDocument.title,
                content: this.newDocument.content,
                createdAt: new Date(),
                fileId: 'file' + Date.now(),
                fileName: this.newDocument.file.name,
            };

            const lession = this.lessions.find((l) => l.id === this.newDocument.lessionId);
            if (lession) {
                lession.documents.push(document);
            }

            this.closeDocumentModal();
        }
    }

    // Assignment management
    openAssignmentModal(lessionId: string) {
        this.newAssignment = { lessionId, title: '', content: '', deadline: '' };
        this.showAssignmentModal = true;
    }

    closeAssignmentModal() {
        this.showAssignmentModal = false;
    }

    createAssignment() {
        if (this.newAssignment.title && this.newAssignment.content && this.newAssignment.deadline) {
            const deadlineDate = this.parseDate(this.newAssignment.deadline);
            if (deadlineDate && deadlineDate > new Date()) {
                const assignment: Assignment = {
                    id: Date.now().toString(),
                    lessionId: this.newAssignment.lessionId,
                    title: this.newAssignment.title,
                    content: this.newAssignment.content,
                    deadline: deadlineDate,
                };

                const lession = this.lessions.find((l) => l.id === this.newAssignment.lessionId);
                if (lession) {
                    lession.assignments.push(assignment);
                }

                this.closeAssignmentModal();
            } else {
                alert('Deadline phải là ngày trong tương lai!');
            }
        }
    }

    goToSubmissions(lessionId: string) {
        this.router.navigate(['/lecturer/submissions'], { queryParams: { lessionId } });
    }

    // Utility methods
    parseDate(dateString: string): Date | null {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return null;
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('vi-VN');
    }

    confirmDeleteAssignment(assignment: Assignment): void {
        this.assignmentToDelete = assignment;
        // Sử dụng Bootstrap modal
        const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteAssignmentModal'));
        modal.show();
    }

    deleteAssignment(): void {
        if (this.assignmentToDelete) {
            // Đóng modal
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteAssignmentModal'));
            modal.hide();

            // Reset
            this.assignmentToDelete = null;

            // Có thể thêm toast notification ở đây
            console.log('Đã xóa bài tập thành công');
        }
    }

    confirmDeleteDocument(documentToDelete: Document): void {
        this.documentToDelete = documentToDelete;
        // Sử dụng Bootstrap modal
        const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteDocumentModal'));
        modal.show();
    }

    deleteDocument(): void {
        if (this.documentToDelete) {
            // Đóng modal
            const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('deleteDocumentModal'));
            modal.hide();

            // Reset
            this.assignmentToDelete = null;

            // Có thể thêm toast notification ở đây
            console.log('Đã xóa tài liệu thành công');
        }
    }
}
