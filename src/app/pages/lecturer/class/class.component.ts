import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { toolbarOptions } from '../../../core/configs/editor.config';
import { AnnouncementRequest, AnnouncementResponse } from '../../../core/models/api/announcement.model';
import { AssignmentRequest, AssignmentResponse } from '../../../core/models/api/assignment.model';
import { DocumentRequest, DocumentResponse } from '../../../core/models/api/document.model';
import { LessionResponse } from '../../../core/models/api/lession.model';
import { AnnouncementService } from '../../../core/services/api/announcement.service';
import { AssignmentService } from '../../../core/services/api/assignment.service';
import { DocumentService } from '../../../core/services/api/document.service';
import { ToastService } from '../../../core/services/ui/toast.service';
import { mockAnnouncements, mockLessions } from '../../../core/utils/mockdata.util';
import { LessionService } from './../../../core/services/api/lession.service';
@Component({
    selector: 'lecturer-class-page',
    imports: [CommonModule, RouterModule, FormsModule, NgbModule, NgxEditorComponent, NgxEditorMenuComponent],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class LecturerClassPage implements OnInit, OnDestroy {
    editor!: Editor;
    toolBar: Toolbar = toolbarOptions;

    createAssignmentModalRef: any;
    createDocumentModalRef: any;
    createAnnouncementModalRef: any;

    deleteAssignmentModalRef: any;
    deleteDocumentModalRef: any;
    viewAnnouncementDetailModalRef: any;

    lessions: LessionResponse[] = [];
    announcements: AnnouncementResponse[] = [];
    selectedFile: File | null = null;
    classId: string | null = null;

    isDeletingDocument = false;
    isDeletingAnnouncement = false;
    isDeletingAssignment = false;

    isCreatingDocument = false;
    isCreatingAnnouncement = false;
    isCreatingAssignment = false;

    isLoadingLessions = false;
    isLoadingAnnouncements = false;

    // Modal states
    assignmentToDelete: AssignmentResponse | null = null;
    documentToDelete: DocumentResponse | null = null;

    // Form data
    newAnnouncement: AnnouncementRequest = { title: '', content: '', classId: '' };
    newDocument: DocumentRequest = { lessionId: '', title: '', content: '' };
    newAssignment: AssignmentRequest = { lessionId: '', title: '', content: '', deadline: new Date() };
    selectedAnnouncement: AnnouncementResponse | null = null;

    // Dropdown states
    expandedLessions: Set<string> = new Set();
    loadedResources: Set<string> = new Set();
    loadingResources: Set<string> = new Set();
    showAnnouncementDropdown = false;

    constructor(
        private readonly router: Router,
        private readonly modalService: NgbModal,
        private readonly toastService: ToastService,
        private readonly announcementService: AnnouncementService,
        private readonly docService: DocumentService,
        private readonly assignmentService: AssignmentService,
        private readonly lessionService: LessionService,
    ) {}

    ngOnInit() {
        // Load query parameters classId
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        console.log('Query Params:', queryParams);

        if (queryParams['id']) {
            this.classId = queryParams['id'];
        }

        if (!this.editor) {
            this.editor = new Editor({
                history: true,
                keyboardShortcuts: true,
                inputRules: true,
            });
        }

        this.loadLessions();
        this.loadAnnouncements();
    }

    ngOnDestroy(): void {
        this.editor?.destroy();
        this.createAnnouncementModalRef?.close();
        this.createDocumentModalRef?.close();
        this.createAssignmentModalRef?.close();
        this.deleteAssignmentModalRef?.close();
        this.deleteDocumentModalRef?.close();
        this.viewAnnouncementDetailModalRef?.close();
        this.selectedFile = null;
    }

    goToManageStudent() {
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        const classId = queryParams['id'];
        this.router.navigate(['/lecturer/classes/students'], { queryParams: { classId } });
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

    openAnnouncementModal(content: TemplateRef<any>) {
        this.createAnnouncementModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

    createAnnouncement() {
        if (this.isCreatingAnnouncement) {
            return;
        }

        if (this.newAnnouncement.title && this.newAnnouncement.content) {
            this.isCreatingAnnouncement = true;
            this.announcementService.create(this.newAnnouncement).subscribe({
                next: (response) => {
                    this.toastService.show('Đã tạo thông báo thành công', 'success');
                    this.announcements.unshift(response);
                    this.closeCreateAnnouncementModal();
                },
                error: (error) => {
                    console.error('Error creating announcement:', error);
                    this.toastService.show('An error occurred while creating the announcement.', 'error');
                    this.closeCreateAnnouncementModal();
                },
            });
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

    closeDocumentModal() {
        this.createDocumentModalRef?.close();
        this.selectedFile = null;
        this.newDocument = { lessionId: '', title: '', content: '' };
        this.isCreatingDocument = false;
    }

    createDocument() {
        if (this.isCreatingDocument) {
            return;
        }

        if (this.newDocument.title && this.newDocument.content && this.selectedFile) {
            this.isCreatingDocument = true;
            this.docService.create(this.newDocument, this.selectedFile).subscribe({
                next: (response) => {
                    this.toastService.show('Đã tạo tài liệu thành công', 'success');
                    this.lessions = this.lessions.map((lession) => {
                        if (lession.id === this.newDocument.lessionId) {
                            return {
                                ...lession,
                                documents: [...(lession.documents || []), response],
                            };
                        }
                        return lession;
                    });
                    this.closeDocumentModal();
                },
                error: (error) => {
                    console.error('Error creating document:', error);
                    this.toastService.show('An error occurred while creating the document.', 'error');
                    this.closeDocumentModal();
                },
            });
        }
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        this.selectedFile = file;
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
        this.isCreatingAssignment = false;
    }

    createAssignment() {
        if (this.isCreatingAssignment) {
            return;
        }

        if (this.newAssignment.title && this.newAssignment.content && this.newAssignment.deadline) {
            this.isCreatingAssignment = true;
            this.assignmentService.create(this.newAssignment).subscribe({
                next: (response) => {
                    this.toastService.show('Đã tạo bài tập thành công', 'success');
                    this.lessions = this.lessions.map((lession) => {
                        if (lession.id === this.newAssignment.lessionId) {
                            return {
                                ...lession,
                                assignments: [...(lession.assignments || []), response],
                            };
                        }
                        return lession;
                    });
                    this.closeAssignmentModal();
                },
                error: (error) => {
                    console.error('Error creating assignment:', error);
                    this.toastService.show('An error occurred while creating the assignment.', 'error');
                    this.closeAssignmentModal();
                },
            });
        }
    }

    confirmDeleteAssignment(assignment: AssignmentResponse, content: TemplateRef<any>): void {
        this.assignmentToDelete = assignment;
        this.deleteAssignmentModalRef = this.modalService.open(content, { centered: true });
    }

    deleteAssignment(): void {
        if (this.isDeletingAssignment) {
            return;
        }

        if (this.assignmentToDelete) {
            this.isDeletingAssignment = true;
            this.assignmentService.delete(this.assignmentToDelete.id).subscribe({
                next: () => {
                    this.toastService.show('Đã xóa bài tập thành công', 'success');
                    this.lessions = this.lessions.map((lession) => {
                        return {
                            ...lession,
                            assignments:
                                lession.assignments?.filter(
                                    (assignment) => assignment.id !== this.assignmentToDelete!.id,
                                ) || [],
                        };
                    });

                    this.closeDeleteAssignmentModal();
                },
                error: (error) => {
                    console.error('Error deleting assignment:', error);
                    this.toastService.show('An error occurred while deleting the assignment.', 'error');
                    this.closeDeleteAssignmentModal();
                },
            });
        }
    }

    confirmDeleteDocument(documentToDelete: DocumentResponse, content: TemplateRef<any>): void {
        this.documentToDelete = documentToDelete;
        this.deleteDocumentModalRef = this.modalService.open(content, { centered: true });
    }

    deleteDocument(): void {
        if (this.documentToDelete) {
            this.docService.delete(this.documentToDelete.id).subscribe({
                next: () => {
                    this.toastService.show('Đã xóa tài liệu thành công', 'success');
                    this.lessions = this.lessions.map((lession) => {
                        return {
                            ...lession,
                            documents: lession.documents?.filter((doc) => doc.id !== this.documentToDelete!.id) || [],
                        };
                    });
                    this.deleteDocumentModalRef?.close();
                    this.assignmentToDelete = null;
                },
                error: (error) => {
                    console.error('Error deleting document:', error);
                    this.toastService.show('An error occurred while deleting the document.', 'error');
                    this.deleteDocumentModalRef?.close();
                    this.assignmentToDelete = null;
                },
            });
        }
    }

    goToSubmissions(lessionId: string) {
        this.router.navigate(['/lecturer/submissions'], { queryParams: { lessionId } });
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
            this.newAssignment.title.trim() === '' ||
            this.newAssignment.content.trim() === '' ||
            !this.newAssignment.deadline ||
            this.newAssignment.deadline < new Date()
        );
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
                console.error('Error loading lession resource:', error);
                this.toastService.show('An error occurred while loading the lession resource.', 'error');
                this.loadingResources.delete(lessionId);
            },
        });
    }

    private closeDeleteAssignmentModal() {
        this.deleteAssignmentModalRef?.close();
        this.assignmentToDelete = null;
        this.isDeletingAssignment = false;
    }

    private closeCreateAnnouncementModal() {
        this.createAnnouncementModalRef?.close();
        this.newAnnouncement = { classId: this.newAnnouncement.classId, title: '', content: '' };
        this.isCreatingAnnouncement = false;
    }

    private loadLessions() {
        if (!this.classId) {
            console.error('Class ID is not set. Cannot load lessions.');
            return;
        }

        this.isLoadingLessions = true;
        this.lessionService.getLessionsByClassId(this.classId).subscribe({
            next: (lessions) => {
                this.lessions = lessions;
                this.isLoadingLessions = false;
            },
            error: (error) => {
                console.error('Error loading lessions:', error);
                this.toastService.show('An error occurred while loading the lessions.', 'error');
                this.isLoadingLessions = false;
            },
        });
    }

    private loadAnnouncements() {
        if (!this.classId) {
            console.error('Class ID is not set. Cannot load announcements.');
            return;
        }

        this.isLoadingAnnouncements = true;
        this.announcementService
            .getAll({
                classId: this.classId,
                page: 0,
                pageSize: 10,
            })
            .subscribe({
                next: (announcements) => {
                    this.announcements = announcements.content;
                    this.isLoadingAnnouncements = false;
                },
                error: (error) => {
                    console.error('Error loading announcements:', error);
                    this.toastService.show('An error occurred while loading the announcements.', 'error');
                    this.isLoadingAnnouncements = false;
                },
            });
    }
}
