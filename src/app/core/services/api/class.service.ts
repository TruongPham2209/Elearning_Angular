import { Injectable } from '@angular/core';
import { BaseFetchingService } from './base.service';
import { Observable } from 'rxjs';
import { SemesterWithClassesResponse } from '../../models/api/semester.model';
import { BanStudentRequest, StudentResponse } from '../../models/api/student.model';
import { ClassForm, ClassResponse } from '../../models/api/class.model';

@Injectable({
    providedIn: 'root',
})
export class ClassService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getById(id: string): Observable<ClassResponse> {
        return this.fetchingService.get(`/api/classes/${id}/`);
    }

    getClasses(): Observable<SemesterWithClassesResponse[]> {
        return this.fetchingService.get(`/api/classes/`);
    }

    getClassesByFilter(courseId: string, semesterId: string): Observable<ClassResponse[]> {
        return this.fetchingService.post(`/api/classes/filter`, { courseId, semesterId });
    }

    getStudentsInClass(classId: string): Observable<StudentResponse[]> {
        return this.fetchingService.get(`/api/classes/${classId}/students/`);
    }

    deleteById(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/classes/${id}/`);
    }

    createClass(req: ClassForm): Observable<void> {
        return this.fetchingService.post(`/api/classes/`, req);
    }

    banStudents(req: BanStudentRequest): Observable<void> {
        return this.fetchingService.post(`/api/classes/ban-students`, req);
    }
}
