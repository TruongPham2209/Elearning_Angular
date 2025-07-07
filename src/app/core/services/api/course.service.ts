import { Injectable } from '@angular/core';
import { BaseFetchingService } from './base.service';
import { CourseFilter, CourseForm, CourseResponse } from '../../models/api/course.model';
import { Observable } from 'rxjs';
import { Page } from '../../models/types/page.interface';

@Injectable({
    providedIn: 'root',
})
export class CourseService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getById(id: string): Observable<CourseResponse> {
        return this.fetchingService.get(`/api/courses/${id}`);
    }

    getCourses(filter: CourseFilter): Observable<Page<CourseResponse>> {
        return this.fetchingService.post(`/api/courses/filter`, filter);
    }

    save(req: CourseForm): Observable<CourseResponse> {
        if (req.id.trim()) {
            return this.fetchingService.put(`/api/courses/${req.id}`, req);
        }

        return this.fetchingService.post(`/api/courses/`, req);
    }

    deleteById(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/courses/${id}`);
    }
}
