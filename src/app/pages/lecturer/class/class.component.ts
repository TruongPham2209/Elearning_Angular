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
import { LessionService } from './../../../core/services/api/lession.service';
import { ClassResponse } from '../../../core/models/api/class.model';
import { ClassService } from '../../../core/services/api/class.service';
import { FileService } from '../../../core/services/api/file.service';
@Component({
    selector: 'lecturer-class-page',
    imports: [CommonModule, RouterModule, FormsModule, NgbModule, NgxEditorComponent, NgxEditorMenuComponent],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss',
})
export class LecturerClassPage implements OnInit, OnDestroy {
    editor!: Editor;
    toolBar: Toolbar = toolbarOptions;

    minDate: string = new Date().toISOString().split('T')[0];

    createAssignmentModalRef: any;
    createDocumentModalRef: any;
    createAnnouncementModalRef: any;

    deleteAssignmentModalRef: any;
    deleteDocumentModalRef: any;

    viewDocumentDetailModalRef: any;
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
    currentClass: ClassResponse | null = null;
    assignmentToDelete: AssignmentResponse | null = null;
    documentToDelete: DocumentResponse | null = null;
    selectedAnnouncement: AnnouncementResponse | null = null;
    selectedDocument: DocumentResponse | null = null;

    // Form data
    newAnnouncement: AnnouncementRequest = { title: '', content: '', classId: '' };
    newDocument: DocumentRequest = { lessionId: '', title: '', content: '' };
    newAssignment: AssignmentRequest = { lessionId: '', title: '', content: '', deadline: new Date() };

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
        private readonly classService: ClassService,
        private readonly fileService: FileService,
    ) {}

    ngOnInit() {
        // Load query parameters classId
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        console.log('Query Params:', queryParams);

        if (!queryParams['id']) {
            this.router.navigate(['/lecturer/home']);
            this.toastService.show('Không tìm thấy lớp học. Vui lòng chọn lớp học khác.', 'error');
            return;
        }

        if (!this.editor) {
            this.editor = new Editor({
                history: true,
                keyboardShortcuts: true,
                inputRules: true,
            });
        }

        this.classId = queryParams['id'];
        this.classService.getById(this.classId!).subscribe({
            next: (classResponse) => {
                this.currentClass = classResponse;
                this.newAnnouncement.classId = classResponse.id;
                this.newDocument.lessionId = classResponse.id;

                this.loadLessions();
                this.loadAnnouncements();
            },
            error: (error) => {
                this.toastService.show('Lỗi trong quá trình tải thông tin lớp học. ' + (error.message || ''), 'error');
                this.router.navigate(['/lecturer/home']);
            },
        });
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
                    this.toastService.show(
                        'Lỗi trong quá trình tạo thông báo cho lớp học. ' + (error.message || ''),
                        'error',
                    );
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
    viewDocumentDetail(document: DocumentResponse, content: TemplateRef<any>) {
        this.selectedDocument = document;
        this.viewDocumentDetailModalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    }

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
                    this.toastService.show('Lỗi trong quá trình tạo tài liệu. ' + (error.message || ''), 'error');
                    this.closeDocumentModal();
                },
            });
        }
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        this.selectedFile = file;
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
                    this.toastService.show('Lỗi trong quá trinhfh gỡ bài tập. ' + (error.message || ''), 'error');
                    this.deleteDocumentModalRef?.close();
                    this.assignmentToDelete = null;
                },
            });
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
                    this.toastService.show('Lỗi trong quá trình giao bài tập. ' + (error.message || ''), 'error');
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
                    this.toastService.show('Lỗi trong quá trình gỡ bài tập. ' + (error.message || ''), 'error');
                    this.closeDeleteAssignmentModal();
                },
            });
        }
    }

    goToSubmissions(assignmentId: string) {
        this.router.navigate(['/lecturer/submissions'], { queryParams: { assignmentId } });
    }
    // Disable states
    disableCreateAnnouncementButton(): boolean {
        return this.newAnnouncement.title.trim() === '' || this.newAnnouncement.content.trim() === '';
    }

    disableCreateDocumentButton(): boolean {
        return this.newDocument.title.trim() === '' || this.newDocument.content.trim() === '' || !this.selectedFile;
    }

    disableCreateAssignmentButton(): boolean {
        return (
            this.newAssignment.title.trim() === '' ||
            this.newAssignment.content.trim() === '' ||
            !this.newAssignment.deadline ||
            this.newAssignment.deadline < new Date()
        );
    }

    downloadFile(fileId: string | undefined) {
        if (!fileId) {
            this.toastService.show('Không tìm thấy tệp để tải xuống.', 'error');
            return;
        }

        this.fileService.downloadFileById(fileId).subscribe({
            next: () => {
                this.toastService.show('Tải xuống thành công.', 'success');
            },
            error: (error) => {
                this.toastService.show('Không thể tải xuống tệp. ' + (error.message || ''), 'error');
            },
        });
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
                this.toastService.show('Lỗi trong quá trình tải buổi học. ' + (error.message || ''), 'error');
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
                    this.announcements = announcements.contents;
                    this.isLoadingAnnouncements = false;
                },
                error: (error) => {
                    this.toastService.show('Lỗi trong quá trình tải thông báo. ' + (error.message || ''), 'error');
                    this.isLoadingAnnouncements = false;
                },
            });
    }
}
