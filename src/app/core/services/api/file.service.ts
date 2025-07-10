import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '../auth/authentication.service';
import { GATEWAY } from '../../../../environments/endpoint.env';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor(
        private readonly http: HttpClient,
        private readonly authService: AuthenticationService,
    ) {}

    downloadFileById(id: string): Observable<void> {
        const url = `${GATEWAY}/api/files/${id}`;
        return this.downloadFileByUrl(url);
    }

    downloadAllSubmissions(assignmentId: string): Observable<void> {
        const url = `${GATEWAY}/api/files/${assignmentId}/submissions/download`;
        return this.downloadFileByUrl(url);
    }

    private downloadFileByUrl(url: string): Observable<void> {
        return this.http
            .get(url, {
                responseType: 'blob',
                observe: 'response',
                headers: {
                    Authorization: `Bearer ${this.authService.getToken()}`,
                },
            })
            .pipe(
                map((response: HttpResponse<Blob>) => {
                    const originalBlob = response.body;
                    if (!originalBlob || originalBlob.size === 0) {
                        throw new Error('Empty file received');
                    }

                    const contentType = response.headers.get('Content-Type');
                    const filename = this.extractFilenameFromResponse(response);

                    // Nếu Content-Type không rõ ràng thì lấy MIME từ file extension
                    const finalMimeType =
                        contentType && contentType !== 'application/octet-stream'
                            ? contentType
                            : this.getMimeTypeFromFilename(filename);

                    const blob = new Blob([originalBlob], { type: finalMimeType });

                    this.triggerFileDownload(blob, filename);
                }),
            );
    }

    /**
     * Lấy tên file từ Content-Disposition header
     */
    private extractFilenameFromResponse(response: HttpResponse<Blob>): string {
        const contentDisposition = response.headers.get('Content-Disposition');

        if (contentDisposition) {
            // Xử lý các format khác nhau của Content-Disposition
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);

            if (matches != null && matches[1]) {
                let filename = matches[1].replace(/['"]/g, '');
                // Decode nếu filename được encode
                try {
                    filename = decodeURIComponent(filename);
                } catch (e) {
                    // Nếu decode lỗi thì giữ nguyên
                }
                return filename;
            }
        }

        // Fallback: tạo tên file mặc định với timestamp
        return `download_${new Date().getTime()}`;
    }

    /**
     * Detect MIME type từ file extension
     */
    private getMimeTypeFromFilename(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: { [key: string]: string } = {
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ppt: 'application/vnd.ms-powerpoint',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            txt: 'text/plain',
            csv: 'text/csv',
            zip: 'application/zip',
            rar: 'application/x-rar-compressed',
        };

        return mimeTypes[ext || ''] || 'application/octet-stream';
    }

    /**
     * Trigger download file trong browser
     */
    private triggerFileDownload(blob: Blob, filename: string): void {
        // Tạo URL cho blob
        const url = window.URL.createObjectURL(blob);

        // Tạo thẻ a ẩn để trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        // Thêm vào DOM, click và xóa
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Giải phóng URL để tránh memory leak
        window.URL.revokeObjectURL(url);
    }
}
