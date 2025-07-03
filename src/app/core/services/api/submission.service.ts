import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessionResponse } from '../../models/api/lession.model';
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

    getById(id: string): Observable<LessionResponse> {
        return this.fetchingService.get(`/api/submissions/${id}`);
    }

    submit(assignmentId: string, file: File): Observable<SubmissionResponse> {
        const formData = new FormData();
        formData.append('assignmentId', assignmentId);
        formData.append('file', file);

        return this.fetchingService.post(`/api/submissions/`, formData, true);
    }

    remove(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/submissions/${id}`);
    }
}
