import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LessionResponse } from '../../../core/models/api/lession.model';
import { AnnouncementFilter, AnnouncementResponse } from '../../../core/models/api/announcement.model';
import { AnnouncementService } from '../../../core/services/api/announcement.service';
import { LessionService } from '../../../core/services/api/lession.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { ClassResponse } from '../../../core/models/api/class.model';
import { ClassService } from '../../../core/services/api/class.service';
import { Page } from '../../../core/models/types/page.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentResponse } from '../../../core/models/api/document.model';
@Component({
    selector: 'web-class-page',
    imports: [CommonModule, RouterModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class WebClassPage implements OnInit {
    lessions: LessionResponse[] = [];
    announcements: Page<AnnouncementResponse> = {
        contents: [],
        totalPages: 0,
        currentPage: 0,
        pageSize: 10,
    };

    // Modal references
    viewDocumentDetailModalRef: any;
    viewAnnouncementDetailModalRef: any;

    // state
    isLoadingLessions = false;
    isLoadingAnnouncements = false;

    // Form data
    currentClass!: ClassResponse;
    selectedAnnouncement: AnnouncementResponse | null = null;
    selectedDocument: DocumentResponse | null = null;
    announcementFilter: AnnouncementFilter = {
        classId: '',
        page: 0,
        pageSize: 10,
    };

    // Dropdown states
    expandedLessions: Set<string> = new Set();
    loadedResources: Set<string> = new Set();
    loadingResources: Set<string> = new Set();
    showAnnouncementDropdown = false;

    constructor(
        private readonly router: Router,
        private readonly announcementService: AnnouncementService,
        private readonly lessionService: LessionService,
        private readonly toastService: ToastService,
        private readonly classService: ClassService,
        private readonly modalService: NgbModal,
    ) {}

    ngOnInit() {
        // Lấy classId từ queryParams
        const classId = this.router.routerState.snapshot.root.queryParams['classId'];
        if (!classId) {
            this.toastService.show('Không tìm thấy lớp học. ', 'error');
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
                this.toastService.show('Không thể tải thông tin lớp học. ' + (error.message || ''), 'error');
                this.router.navigate(['/home']);
            },
        });
    }

    // Lession management
    toggleLession(lessionId: string) {
        this.expandedLessions.has(lessionId) ? this.expandedLessions.delete(lessionId) : this.loadResource(lessionId);
    }

    isLessionExpanded(lessionId: string): boolean {
        return this.expandedLessions.has(lessionId);
    }

    // Announcement management
    toggleAnnouncementDropdown() {
        this.showAnnouncementDropdown = !this.showAnnouncementDropdown;
    }

    viewAnnouncementDetail(announcement: AnnouncementResponse, content: TemplateRef<any>) {
        this.selectedAnnouncement = announcement;
        this.viewAnnouncementDetailModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    viewDocumentDetail(document: DocumentResponse, content: TemplateRef<any>) {
        this.selectedDocument = document;
        this.viewDocumentDetailModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    goToSubmissions(assignmentId: string) {
        this.router.navigate(['/assignments'], { queryParams: { assignmentId } });
    }

    private loadResource(lessionId: string) {
        this.expandedLessions.add(lessionId);
        if (this.loadedResources.has(lessionId)) {
            return;
        }

        if (this.loadingResources.has(lessionId)) {
            console.warn('Resource is already being loaded:', lessionId);
            return;
        }

        this.loadingResources.add(lessionId);
        this.lessionService.getLessionResource(lessionId).subscribe({
            next: (lession) => {
                this.lessions = this.lessions.map((l) =>
                    l.id === lessionId
                        ? {
                              ...l,
                              assignments: lession.assignments,
                              documents: lession.documents,
                          }
                        : l,
                );
                this.loadedResources.add(lessionId);
                this.loadingResources.delete(lessionId);
            },
            error: (error) => {
                this.toastService.show(
                    'Lỗi trong quá trình tải tài nguyên buổi học. ' + (error.message || ''),
                    'error',
                );
                this.loadingResources.delete(lessionId);
            },
        });
    }

    private loadLessions() {
        if (!this.currentClass) {
            console.error('Class ID is not set. Cannot load lessions.');
            return;
        }

        this.isLoadingLessions = true;
        this.lessionService.getLessionsByClassId(this.currentClass.id).subscribe({
            next: (lessions) => {
                this.lessions = lessions;
                this.isLoadingLessions = false;
            },
            error: (error) => {
                this.toastService.show('Lỗi trong quá trình tải buổi học. ' + (error.message || ''), 'error');
                this.isLoadingLessions = false;
            },
        });
    }

    loadAnnouncements() {
        if (this.isLoadingAnnouncements) return;
        if (this.announcementFilter.page === this.announcements.currentPage) return;

        // Kiểm tra tín hợp lệ của page từ filter so với announcements dựa vào currentPage và pageSize
        if (this.announcementFilter.page < 0 || this.announcementFilter.page >= this.announcements.totalPages) {
            this.toastService.show('Trang không hợp lệ. ', 'error');
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
                this.toastService.show('Không thể tải thông báo. ', 'error');
                this.isLoadingAnnouncements = false;
            },
        });
    }
}
