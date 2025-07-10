import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionFilter, SubmissionResponse } from '../../models/api/submission.model';
import { Page } from '../../models/types/page.interface';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class SubmissionService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getByAssignment(filter: SubmissionFilter): Observable<Page<SubmissionResponse>> {
        return this.fetchingService.post<Page<SubmissionResponse>>(`/api/submissions/filter`, filter);
    }

    getByAssignmentId(assignmentId: string): Observable<SubmissionResponse> {
        return this.fetchingService.get(`/api/submissions/${assignmentId}`);
    }

    submit(assignmentId: string, file: File): Observable<SubmissionResponse> {
        const formData = new FormData();
        formData.append('assignment', new Blob([JSON.stringify({ assignmentId })], { type: 'application/json' }));
        formData.append('file', file);

        return this.fetchingService.post(`/api/submissions/`, formData, true);
    }

    remove(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/submissions/${id}`);
    }
}
