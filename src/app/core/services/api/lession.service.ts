import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LessionResponse } from '../../models/api/lession.model';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class LessionService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getLessionsByClassId(classId: string): Observable<LessionResponse[]> {
        return this.fetchingService.get(`/api/lessions/${classId}`);
    }

    getLessionResource(lessionId: string): Observable<LessionResponse> {
        return this.fetchingService.get(`/api/lession-resource/${lessionId}`);
    }
}
