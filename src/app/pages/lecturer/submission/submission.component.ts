import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentResponse } from '../../../core/models/api/assignment.model';
import { SubmissionFilter, SubmissionLogResponse, SubmissionResponse } from '../../../core/models/api/submission.model';
import { Page } from '../../../core/models/types/page.interface';
import { AssignmentService } from '../../../core/services/api/assignment.service';
import { LoggingService } from '../../../core/services/api/logging.service';
import { SubmissionService } from '../../../core/services/api/submission.service';
import { ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'lecturer-submission-page',
    imports: [CommonModule],
    templateUrl: './submission.component.html',
    styleUrl: './submission.component.scss',
})
export class LecturerSubmissionPage implements OnInit {
    isLoadingSubmissions = false;
    isLoadingHistory = false;
    isDownloadingAll = false;

    assignment!: AssignmentResponse;
    studentSubmissions: Page<SubmissionResponse> = {
        contents: [],
        currentPage: 0,
        pageSize: 10,
        totalPages: 1,
    };
    submissionHistory: Record<string, SubmissionLogResponse[]> = {};
    selectedStudent: SubmissionResponse | null = null;
    showHistoryModal = false;
    filter: SubmissionFilter = {
        assignmentId: '',
        page: 0,
        pageSize: 10,
    };

    constructor(
        private readonly assignmentService: AssignmentService,
        private readonly toastService: ToastService,
        private readonly submissionService: SubmissionService,
        private readonly loggingService: LoggingService,
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        // Lấy assigmentId từ query parameters
        const assignmentId = this.route.snapshot.queryParamMap.get('assignmentId');
        if (!assignmentId) {
            return;
        }

        this.assignmentService.getById(assignmentId).subscribe({
            next: (assignment) => {
                this.assignment = assignment;
                this.filter.assignmentId = assignment.id;
                this.loadSubmissions();
            },
            error: (error) => {
                this.toastService.show('Không thể tải thông tin bài tập. ' + (error.message || ''), 'error');
            },
        });
    }

    loadSubmissions(): void {
        if (this.isLoadingSubmissions) {
            return;
        }

        this.isLoadingSubmissions = true;
        this.submissionService.getByAssignment(this.filter).subscribe({
            next: (submissions) => {
                this.studentSubmissions = submissions;
                this.filter.page = submissions.currentPage;
                this.filter.pageSize = submissions.pageSize;
                this.isLoadingSubmissions = false;
            },
            error: (error) => {
                this.toastService.show('Không thể tải danh sách bài nộp. ' + (error.message || ''), 'error');
                this.isLoadingSubmissions = false;
            },
        });
    }

    downloadAllSubmissions(): void {
        console.log('Downloading all submissions...');
        // Implement download logic here
        alert('Đang tải xuống tất cả bài nộp...');
    }

    getSubmissionHistories(studentCode: string): SubmissionLogResponse[] {
        return this.submissionHistory[studentCode] || [];
    }

    viewSubmissionHistory(student: SubmissionResponse): void {
        this.selectedStudent = student;
        this.showHistoryModal = true;

        if (this.submissionHistory[student.studentCode]) {
            return;
        }

        this.isLoadingHistory = true;
        this.loggingService.getSubmission(this.filter.assignmentId, student.studentCode).subscribe({
            next: (logs) => {
                this.submissionHistory[student.studentCode] = logs;
                this.isLoadingHistory = false;
                if (logs.length === 0) {
                    this.toastService.show('Không có lịch sử nộp bài cho học sinh này.', 'info');
                }
            },
            error: (error) => {
                this.toastService.show('Không thể tải lịch sử nộp bài. ' + (error.message || ''), 'error');
                this.isLoadingHistory = false;
            },
        });
    }

    downloadFile(student: SubmissionResponse): void {
        if (student.fileId) {
            console.log(`Downloading file: ${student.fileName} for student: ${student.studentCode}`);
            this.toastService.show(`Đang tải xuống file: ${student.fileName}`, 'info');
        }
    }

    closeModal(): void {
        this.showHistoryModal = false;
        this.selectedStudent = null;
    }

    getActionText(action: string): string {
        return action === 'submit' ? 'Nộp bài' : 'Gỡ bài';
    }

    getActionBadgeClass(action: string): string {
        return action === 'submit' ? 'badge-success' : 'badge-warning';
    }

    getStatusText(isSubmitted: boolean): string {
        return isSubmitted ? 'Đã nộp' : 'Chưa nộp';
    }

    getStatusBadgeClass(isSubmitted: boolean): string {
        return isSubmitted ? 'badge-success' : 'badge-secondary';
    }
}
