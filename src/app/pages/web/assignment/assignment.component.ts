import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AssignmentResponse } from '../../../core/models/api/assignment.model';
import { SubmissionResponse } from '../../../core/models/api/submission.model';
import { ToastService } from '../../../core/services/ui/toast.service';
import { SubmissionService } from '../../../core/services/api/submission.service';
import { AssignmentService } from '../../../core/services/api/assignment.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'web-assignment-page',
    imports: [CommonModule, NgbModule],
    templateUrl: './assignment.component.html',
    styleUrl: './assignment.component.scss',
})
export class WebAssignmentPage implements OnInit {
    removeSubmissionModal: any;

    assignment!: AssignmentResponse;
    submission: SubmissionResponse | null = null;

    // Để demo, có thể toggle giữa đã nộp và chưa nộp
    isSubmitted = true;
    isSubmitting = false;
    isRemoving = false;

    isDragOver = false;
    selectedFile: File | null = null;

    constructor(
        private readonly toastService: ToastService,
        private readonly assignmentService: AssignmentService,
        private readonly submissionService: SubmissionService,
        private readonly ngbModal: NgbModal,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        // Lấy assignmentId từ query params hoặc route params
        const assignmentId = this.route.snapshot.queryParamMap.get('assignmentId');
        if (!assignmentId) {
            this.toastService.show('Không tìm thấy assignmentId trong URL!', 'error');
            // this.router.navigate(['/home']);
            return;
        }

        this.assignmentService.getById(assignmentId).subscribe({
            next: (response) => {
                this.assignment = response;
                this.loadSubmission();
            },
            error: (error) => {
                this.toastService.show('Không thể tải thông tin bài tập! ' + (error.message || ''), 'error');
                // this.router.navigate(['/home']);
            },
        });
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragOver = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.isDragOver = false;
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragOver = false;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.handleFileSelect(input.files[0]);
        }
    }

    handleFileSelect(file: File) {
        if (file.size > 50 * 1024 * 1024) {
            // 50MB limit
            this.toastService.show('File quá lớn, vui lòng chọn file nhỏ hơn 50MB!', 'error');
            return;
        }

        this.selectedFile = file;
    }

    openConfirmDeleteModal(content: TemplateRef<any>) {
        this.removeSubmissionModal = this.ngbModal.open(content, {
            centered: true,
        });
    }

    submitAssignment() {
        if (!this.selectedFile) {
            this.toastService.show('Vui lòng chọn file để nộp bài!', 'warning');
            return;
        }

        if (this.assignment.deadline < new Date()) {
            this.toastService.show('Hạn nộp bài đã qua!', 'error');
            return;
        }

        if (this.isSubmitting) {
            this.toastService.show('Đang nộp bài, vui lòng đợi!', 'warning');
            return;
        }

        this.isSubmitting = true;
        console.log('Submitting file:', this.selectedFile.name);
        this.submissionService.submit(this.assignment.id, this.selectedFile).subscribe({
            next: (response) => {
                this.submission = response;
                this.isSubmitted = true;
                this.selectedFile = null;

                this.toastService.show('Nộp bài thành công!', 'success');
                this.isSubmitting = false;
            },
            error: (error) => {
                this.toastService.show('Nộp bài thất bại! ' + (error.message || ''), 'error');
                this.isSubmitting = false;
            },
        });
    }

    confirmRemoveSubmission() {
        if (this.isRemoving) {
            this.toastService.show('Đang gỡ bài, vui lòng đợi!', 'warning');
            return;
        }

        if (!this.submission) {
            this.toastService.show('Không có bài nộp nào để gỡ!', 'warning');
            return;
        }

        this.isRemoving = true;
        this.submissionService.remove(this.submission.id).subscribe({
            next: () => {
                this.toastService.show('Gỡ bài thành công!', 'success');
                this.removeSubmissionModal?.close();

                this.submission = null;
                this.isSubmitted = false;
                this.isRemoving = false;
            },
            error: (error) => {
                this.toastService.show('Gỡ bài nộp thất bại! ' + (error.message || ''), 'error');
                this.isRemoving = false;
            },
        });
    }

    downloadSubmission() {
        if (this.submission) {
            const link = document.createElement('a');
            link.href = this.submission.fileId;
            link.download = this.submission.fileName;
            link.click();
        }
    }

    isDeadlinePassed(): boolean {
        const isDeadlinePassed = new Date() > new Date(this.assignment.deadline);
        return isDeadlinePassed;
    }

    getDeadlineStatus(): { class: string; text: string } {
        const now = new Date();
        const deadline = new Date(this.assignment.deadline); // đảm bảo là Date

        const timeDiff = deadline.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (timeDiff < 0) {
            return { class: 'text-danger', text: 'Đã quá hạn' };
        } else if (daysDiff <= 1) {
            return { class: 'text-warning', text: 'Sắp hết hạn' };
        } else {
            return { class: 'text-success', text: 'Còn thời gian' };
        }
    }

    private loadSubmission(): void {
        const assignmentId = this.assignment.id;
        this.submissionService.getByAssignmentId(assignmentId).subscribe({
            next: (response) => {
                this.submission = response;
                this.isSubmitted = response.submitted;
            },
            error: (error) => {
                this.toastService.show('Không thể tải thông tin nộp bài! ' + (error.message || ''), 'error');
            },
        });
    }
}
