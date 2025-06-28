import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnnouncementRequest, AnnouncementResponse } from '../../../core/models/api/announcement.model';
import { AssignmentRequest, AssignmentResponse } from '../../../core/models/api/assignment.model';
import { DocumentRequest, DocumentResponse } from '../../../core/models/api/document.model';
import { LessionResponse } from '../../../core/models/api/lession.model';
import { mockAnnouncements, mockLessions } from '../../../core/utils/mockdata.util';

@Component({
    selector: 'lecturer-class-page',
    imports: [CommonModule, RouterModule, FormsModule, NgbModule],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class LecturerClassPage implements OnInit {
    createAssignmentModalRef: any;
    createDocumentModalRef: any;
    createAnnouncementModalRef: any;

    deleteAssignmentModalRef: any;
    deleteDocumentModalRef: any;
    viewAnnouncementDetailModalRef: any;

    lessions: LessionResponse[] = mockLessions;
    announcements: AnnouncementResponse[] = mockAnnouncements;
    selectedFile: File | null = null;

    // Modal states
    showAnnouncementModal = false;
    showDocumentModal = false;
    showAssignmentModal = false;
    showAnnouncementDetailModal = false;
    assignmentToDelete: AssignmentResponse | null = null;
    documentToDelete: DocumentResponse | null = null;

    // Form data
    newAnnouncement: AnnouncementRequest = { title: '', content: '', classId: '' };
    newDocument: DocumentRequest = { lessionId: '', title: '', content: '' };
    newAssignment: AssignmentRequest = { lessionId: '', title: '', content: '', deadline: new Date() };
    selectedAnnouncement: AnnouncementResponse | null = null;

    // Dropdown states
    expandedLessions: Set<string> = new Set();
    showAnnouncementDropdown = false;

    constructor(
        private router: Router,
        private modalService: NgbModal,
    ) {}

    ngOnInit() {
        // Load query parameters classId
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        console.log('Query Params:', queryParams);

        if (queryParams['id']) {
            const classId = queryParams['id'];
            console.log('Loaded class with ID:', classId);
        }
    }

    // Lession management
    toggleLession(lessionId: string) {
        this.expandedLessions.has(lessionId)
            ? this.expandedLessions.delete(lessionId)
            : this.expandedLessions.add(lessionId);
    }

    isLessionExpanded(lessionId: string): boolean {
        return this.expandedLessions.has(lessionId);
    }

    // Announcement management
    toggleAnnouncementDropdown() {
        this.showAnnouncementDropdown = !this.showAnnouncementDropdown;
    }

    openAnnouncementModal(content: TemplateRef<any>) {
        this.createAnnouncementModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    closeAnnouncementModal() {
        this.showAnnouncementModal = false;
    }

    createAnnouncement() {
        if (this.newAnnouncement.title && this.newAnnouncement.content) {
            // const announcement: Announcement = {
            //     id: Date.now().toString(),
            //     title: this.newAnnouncement.title,
            //     content: this.newAnnouncement.content,
            //     createdAt: new Date(),
            // };
            // this.announcements.unshift(announcement);
            this.createAnnouncementModalRef?.close();
            this.newAnnouncement = { classId: this.newAnnouncement.classId, title: '', content: '' };
        }
    }

    viewAnnouncementDetail(announcement: AnnouncementResponse, content: TemplateRef<any>) {
        this.selectedAnnouncement = announcement;
        this.viewAnnouncementDetailModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    // Document management
    openDocumentModal(lessionId: string, content: TemplateRef<any>) {
        this.newDocument = { lessionId, title: '', content: '' };
        this.createDocumentModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        this.selectedFile = file;
    }

    closeDocumentModal() {
        this.createDocumentModalRef?.close();
        this.selectedFile = null;
        this.newDocument = { lessionId: '', title: '', content: '' };
    }

    createDocument() {
        if (this.newDocument.title && this.newDocument.content && this.selectedFile) {
            console.log('Creating document:', this.newDocument);
            this.closeDocumentModal();
        }
    }

    // Assignment management
    openAssignmentModal(lessionId: string, content: TemplateRef<any>) {
        this.newAssignment = { lessionId, title: '', content: '', deadline: new Date() };
        this.createAssignmentModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    closeAssignmentModal() {
        this.createAssignmentModalRef?.close();
        this.newAssignment = { lessionId: '', title: '', content: '', deadline: new Date() };
        this.selectedFile = null;
    }

    createAssignment() {
        if (this.newAssignment.title && this.newAssignment.content && this.newAssignment.deadline) {
            console.log('Creating assignment:', this.newAssignment);
            this.closeAssignmentModal();
        }
    }

    goToSubmissions(lessionId: string) {
        this.router.navigate(['/lecturer/submissions'], { queryParams: { lessionId } });
    }

    confirmDeleteAssignment(assignment: AssignmentResponse, content: TemplateRef<any>): void {
        this.assignmentToDelete = assignment;
        this.deleteAssignmentModalRef = this.modalService.open(content, { centered: true });
    }

    deleteAssignment(): void {
        if (this.assignmentToDelete) {
            this.deleteAssignmentModalRef?.close();

            this.assignmentToDelete = null;
            console.log('Đã xóa bài tập thành công');
        }
    }

    confirmDeleteDocument(documentToDelete: DocumentResponse, content: TemplateRef<any>): void {
        this.documentToDelete = documentToDelete;
        this.deleteDocumentModalRef = this.modalService.open(content, { centered: true });
    }

    deleteDocument(): void {
        if (this.documentToDelete) {
            this.deleteDocumentModalRef?.close();

            this.assignmentToDelete = null;
            console.log('Đã xóa tài liệu thành công');
        }
    }

    // Disable states
    disableCreateAnnouncementButton(): boolean {
        return !this.newAnnouncement.title || !this.newAnnouncement.content;
    }

    disableCreateDocumentButton(): boolean {
        return !this.newDocument.title || !this.newDocument.content || !this.selectedFile;
    }

    disableCreateAssignmentButton(): boolean {
        return (
            !this.newAssignment.title ||
            !this.newAssignment.content ||
            !this.newAssignment.deadline ||
            this.newAssignment.deadline < new Date()
        );
    }
}
