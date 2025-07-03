import { Injectable } from '@angular/core';
import { BaseFetchingService } from './base.service';
import { Observable } from 'rxjs';
import { SemesterForm, SemesterResponse } from '../../models/api/semester.model';

@Injectable({
    providedIn: 'root',
})
export class SemesterService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getAll(): Observable<SemesterResponse[]> {
        return this.fetchingService.get<SemesterResponse[]>('/api/semesters/');
    }

    save(req: SemesterForm): Observable<SemesterResponse> {
        if (req.id.trim() !== '') {
            return this.fetchingService.put<SemesterResponse>(`/api/semesters/${req.id.trim()}`, req);
        }

        return this.fetchingService.post<SemesterResponse>('/api/semesters/', req);
    }
}
