import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnnouncementFilter, AnnouncementRequest, AnnouncementResponse } from '../../models/api/announcement.model';
import { Page } from '../../models/types/page.interface';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class AnnouncementService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    getAll(filter: AnnouncementFilter): Observable<Page<AnnouncementResponse>> {
        return this.fetchingService.post(`/api/announcements/filter`, filter);
    }

    create(req: AnnouncementRequest): Observable<AnnouncementResponse> {
        return this.fetchingService.post(`/api/announcements/`, req);
    }

    delete(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/announcements/${id}`);
    }
}
