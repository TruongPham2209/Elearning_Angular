import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Assignment {
    id: string;
    title: string;
    content: string;
    deadline: Date;
}

interface Submission {
    fileName: string;
    downloadUrl: string;
    performAt: Date;
    file?: File;
}

@Component({
    selector: 'web-assignment-page',
    imports: [CommonModule],
    templateUrl: './assignment.component.html',
    styleUrl: './assignment.component.scss',
})
export class WebAssignmentPage {
    assignment: Assignment = {
        id: '1',
        title: 'Bài tập lớn: Xây dựng ứng dụng web với Angular',
        content: `
      <p>Sinh viên cần xây dựng một ứng dụng web hoàn chỉnh sử dụng Angular framework với các yêu cầu sau:</p>
      <ul>
        <li>Sử dụng Angular 19 với TypeScript</li>
        <li>Thiết kế responsive với Bootstrap</li>
        <li>Implement các chức năng CRUD cơ bản</li>
        <li>Tích hợp API REST</li>
        <li>Có validation và error handling</li>
      </ul>
      <p><strong>Lưu ý:</strong> Nộp file dưới dạng ZIP chứa source code và file README hướng dẫn chạy ứng dụng.</p>
    `,
        deadline: new Date('2026-12-31T23:59:59'),
    };

    submission: Submission | null = null;

    // Để demo, có thể toggle giữa đã nộp và chưa nộp
    isSubmitted = false;

    isDragOver = false;
    selectedFile: File | null = null;

    constructor() {
        // Demo data cho trường hợp đã nộp bài
        if (this.isSubmitted) {
            this.submission = {
                fileName: 'baitap-angular-NguyenVanA.zip',
                downloadUrl: '#',
                performAt: new Date('2024-12-15T14:30:00'),
            };
        }
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
        // Validate file (có thể thêm các validation khác như size, type)
        if (file.size > 50 * 1024 * 1024) {
            // 50MB limit
            alert('File quá lớn! Vui lòng chọn file nhỏ hơn 50MB.');
            return;
        }

        this.selectedFile = file;
    }

    submitAssignment() {
        if (!this.selectedFile) {
            alert('Vui lòng chọn file để nộp bài!');
            return;
        }

        // Simulate API call
        console.log('Submitting file:', this.selectedFile.name);

        // Mock submission
        this.submission = {
            fileName: this.selectedFile.name,
            downloadUrl: URL.createObjectURL(this.selectedFile),
            performAt: new Date(),
            file: this.selectedFile,
        };

        this.isSubmitted = true;
        this.selectedFile = null;

        alert('Nộp bài thành công!');
    }

    confirmRemoveSubmission() {
        // Bootstrap modal sẽ được trigger bởi data-bs-toggle
        // Logic xử lý sẽ ở removeSubmission()
    }

    removeSubmission() {
        // Simulate API call to remove submission
        console.log('Removing submission...');

        this.submission = null;
        this.isSubmitted = false;

        // Close modal programmatically
        const modal = document.getElementById('confirmRemoveModal');
        if (modal) {
            const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }

        alert('Đã gỡ bài thành công!');
    }

    downloadSubmission() {
        if (this.submission?.downloadUrl) {
            const link = document.createElement('a');
            link.href = this.submission.downloadUrl;
            link.download = this.submission.fileName;
            link.click();
        }
    }

    formatDateTime(date: Date): string {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    }

    isDeadlinePassed(): boolean {
        return new Date() > this.assignment.deadline;
    }

    getDeadlineStatus(): { class: string; text: string } {
        const now = new Date();
        const deadline = this.assignment.deadline;
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
}
