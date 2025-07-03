import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LessionResponse } from '../../../core/models/api/lession.model';
import { AnnouncementFilter, AnnouncementResponse } from '../../../core/models/api/announcement.model';
import { AnnouncementService } from '../../../core/services/api/announcement.service';
import { LessionService } from '../../../core/services/api/lession.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ClassResponse } from '../../../core/models/api/class.model';
import { ClassService } from '../../../core/services/api/class.service';
import { Page } from '../../../core/models/types/page.interface';
@Component({
    selector: 'web-class-page',
    imports: [CommonModule, RouterModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class WebClassPage implements OnInit {
    lessions: LessionResponse[] = [];
    announcements: Page<AnnouncementResponse> = {
        content: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    // state
    isLoadingAnnouncements = false;

    // Modal states
    showAnnouncementModal = false;
    showDocumentModal = false;
    showAssignmentModal = false;
    showAnnouncementDetailModal = false;

    // Form data
    currentClass!: ClassResponse;
    selectedAnnouncement: AnnouncementResponse | null = null;
    announcementFilter: AnnouncementFilter = {
        classId: '',
        page: 0,
        pageSize: 10,
    };

    // Dropdown states
    expandedLessions: Set<string> = new Set();
    showAnnouncementDropdown = false;

    constructor(
        private readonly router: Router,
        private readonly announcementService: AnnouncementService,
        private readonly lessionService: LessionService,
        private readonly toastService: ToastService,
        private readonly classService: ClassService,
    ) {}

    ngOnInit() {
        // Lấy classId từ queryParams
        const classId = this.router.routerState.snapshot.root.queryParams['classId'];
        if (!classId) {
            this.toastService.show('Không tìm thấy lớp học. Vui lòng thử lại sau.', 'error');
            this.router.navigate(['/home']);
            return;
        }

        this.classService.getById(classId).subscribe({
            next: (classResponse) => {
                this.currentClass = classResponse;
                this.announcementFilter.classId = classResponse.id;
                this.loadLessions();
                this.loadAnnouncements();
            },
            error: (error) => {
                console.error('Error fetching class:', error);
                this.toastService.show('Không thể tải thông tin lớp học. Vui lòng thử lại sau.', 'error');
                // this.router.navigate(['/home']);
            },
        });
    }

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

    viewAnnouncementDetail(announcement: AnnouncementResponse) {
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

    loadAnnouncements() {
        if (this.isLoadingAnnouncements) return;
        if (this.announcementFilter.page === this.announcements.currentPage) return;

        // Kiểm tra tín hợp lệ của page từ filter so với announcements dựa vào currentPage và pageSize
        if (this.announcementFilter.page < 0 || this.announcementFilter.page >= this.announcements.totalPages) {
            this.toastService.show('Trang không hợp lệ. Vui lòng thử lại.', 'error');
            return;
        }

        this.isLoadingAnnouncements = true;
        this.announcementService.getAll(this.announcementFilter).subscribe({
            next: (response) => {
                this.announcements = response;
                this.announcementFilter.page = response.currentPage;
                this.announcementFilter.pageSize = response.pageSize;
                this.isLoadingAnnouncements = false;
            },
            error: (error) => {
                console.error('Error fetching announcements:', error);
                this.toastService.show('Không thể tải thông báo. Vui lòng thử lại sau.', 'error');
                this.isLoadingAnnouncements = false;
            },
        });
    }

    private loadLessions() {
        this.lessionService.getLessionsByClassId(this.currentClass.id).subscribe({
            next: (lessions) => {
                this.lessions = lessions;
            },
            error: (error) => {
                console.error('Error fetching lessions:', error);
                this.toastService.show('Không thể tải các bài học. Vui lòng thử lại sau.', 'error');
            },
        });
    }
}
