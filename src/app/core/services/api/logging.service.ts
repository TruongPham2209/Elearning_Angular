import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BannedStudentResponse } from '../../models/api/student.model';
import { SubmissionLogResponse } from '../../models/api/submission.model';
import { Page } from '../../models/types/page.interface';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class LoggingService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getSubmission(assignmentId: string, studentCode: string): Observable<SubmissionLogResponse[]> {
        return this.fetchingService.get<SubmissionLogResponse[]>(`/api/logs/submissions`, {
            assignmentId,
            studentCode,
        });
    }

    getBanned(classId: string): Observable<BannedStudentResponse[]> {
        return this.fetchingService.get(`/api/logs/banned`, { classId });
    }
}
