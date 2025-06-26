import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    selector: 'web-class-page',
    imports: [CommonModule, RouterModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class WebClassPage implements OnInit {
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

    // Form data
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

    viewAnnouncementDetail(announcement: Announcement) {
        this.selectedAnnouncement = announcement;
        this.showAnnouncementDetailModal = true;
    }

    closeAnnouncementDetailModal() {
        this.showAnnouncementDetailModal = false;
        this.selectedAnnouncement = null;
    }

    goToSubmissions(lessionId: string) {
        this.router.navigate(['/assignments'], { queryParams: { lessionId } });
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
}
