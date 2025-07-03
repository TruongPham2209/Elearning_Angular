import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssignmentRequest, AssignmentResponse } from '../../models/api/assignment.model';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class AssignmentService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    create(req: AssignmentRequest): Observable<AssignmentResponse> {
        return this.fetchingService.post(`/api/assignments/`, req);
    }

    delete(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/assignments/${id}`);
    }

    getById(id: string): Observable<AssignmentResponse> {
        return this.fetchingService.get(`/api/assignments/${id}`);
    }
}
