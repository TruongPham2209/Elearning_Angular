import { Injectable } from '@angular/core';
import { BaseFetchingService } from './base.service';
import { NotificationFilter, NotificationRequest, NotificationResponse } from '../../models/api/notification.model';
import { Observable } from 'rxjs';
import { Page } from '../../models/types/page.interface';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    create(req: NotificationRequest): Observable<NotificationResponse> {
        return this.fetchingService.post('/api/notifications/', req);
    }

    delete(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/notifications/`, { ids: [id] });
    }

    getAll(filter: NotificationFilter): Observable<Page<NotificationResponse>> {
        return this.fetchingService.post(`/api/notifications/filter`, filter);
    }
}
