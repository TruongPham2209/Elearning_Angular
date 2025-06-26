import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SubmissionHistory {
    action: 'submit' | 'remove';
    fileName: string;
    timestamp: Date;
}

interface StudentSubmission {
    studentId: string;
    isSubmitted: boolean;
    fileName?: string;
    submissionTime?: Date;
    fileId?: string;
    submissionHistory: SubmissionHistory[];
}

@Component({
    selector: 'lecturer-submission-page',
    imports: [CommonModule],
    templateUrl: './submission.component.html',
    styleUrl: './submission.component.scss',
})
export class LecturerSubmissionPage {
    assignmentTitle = 'Bài tập lập trình Web với Angular';

    studentSubmissions: StudentSubmission[] = [
        {
            studentId: 'SV001',
            isSubmitted: true,
            fileName: 'baitap_angular_sv001.zip',
            submissionTime: new Date('2024-03-15 14:30:00'),
            fileId: 'file_001',
            submissionHistory: [
                {
                    action: 'submit',
                    fileName: 'baitap_angular_sv001_v1.zip',
                    timestamp: new Date('2024-03-14 10:00:00'),
                },
                {
                    action: 'remove',
                    fileName: 'baitap_angular_sv001_v1.zip',
                    timestamp: new Date('2024-03-14 15:30:00'),
                },
                {
                    action: 'submit',
                    fileName: 'baitap_angular_sv001.zip',
                    timestamp: new Date('2024-03-15 14:30:00'),
                },
            ],
        },
        {
            studentId: 'SV002',
            isSubmitted: false,
            submissionHistory: [
                {
                    action: 'submit',
                    fileName: 'baitap_angular_sv002_draft.zip',
                    timestamp: new Date('2024-03-10 09:15:00'),
                },
                {
                    action: 'remove',
                    fileName: 'baitap_angular_sv002_draft.zip',
                    timestamp: new Date('2024-03-10 10:00:00'),
                },
            ],
        },
        {
            studentId: 'SV003',
            isSubmitted: true,
            fileName: 'angular_project_sv003.rar',
            submissionTime: new Date('2024-03-16 09:45:00'),
            fileId: 'file_003',
            submissionHistory: [
                {
                    action: 'submit',
                    fileName: 'angular_project_sv003.rar',
                    timestamp: new Date('2024-03-16 09:45:00'),
                },
            ],
        },
        {
            studentId: 'SV004',
            isSubmitted: false,
            submissionHistory: [],
        },
        {
            studentId: 'SV005',
            isSubmitted: true,
            fileName: 'web_development_sv005.zip',
            submissionTime: new Date('2024-03-17 16:20:00'),
            fileId: 'file_005',
            submissionHistory: [
                {
                    action: 'submit',
                    fileName: 'web_development_sv005_v1.zip',
                    timestamp: new Date('2024-03-16 14:00:00'),
                },
                {
                    action: 'submit',
                    fileName: 'web_development_sv005.zip',
                    timestamp: new Date('2024-03-17 16:20:00'),
                },
            ],
        },
    ];

    selectedStudent: StudentSubmission | null = null;
    showHistoryModal = false;

    downloadAllSubmissions(): void {
        console.log('Downloading all submissions...');
        // Implement download logic here
        alert('Đang tải xuống tất cả bài nộp...');
    }

    viewSubmissionHistory(student: StudentSubmission): void {
        this.selectedStudent = student;
        this.showHistoryModal = true;
    }

    downloadFile(student: StudentSubmission): void {
        if (student.fileId) {
            console.log(`Downloading file: ${student.fileName} for student: ${student.studentId}`);
            // Implement file download logic here
            alert(`Đang tải xuống file: ${student.fileName}`);
        }
    }

    closeModal(): void {
        this.showHistoryModal = false;
        this.selectedStudent = null;
    }

    getActionText(action: 'submit' | 'remove'): string {
        return action === 'submit' ? 'Nộp bài' : 'Gỡ bài';
    }

    getActionBadgeClass(action: 'submit' | 'remove'): string {
        return action === 'submit' ? 'badge-success' : 'badge-warning';
    }

    getStatusText(isSubmitted: boolean): string {
        return isSubmitted ? 'Đã nộp' : 'Chưa nộp';
    }

    getStatusBadgeClass(isSubmitted: boolean): string {
        return isSubmitted ? 'badge-success' : 'badge-secondary';
    }

    formatDateTime(date: Date): string {
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
}
