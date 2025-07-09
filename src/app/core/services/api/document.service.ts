import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentRequest, DocumentResponse } from '../../models/api/document.model';
import { BaseFetchingService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class DocumentService {
    constructor(private readonly fetchingService: BaseFetchingService) {}

    create(req: DocumentRequest, file: File): Observable<DocumentResponse> {
        const formData = new FormData();
        formData.append('document', new Blob([JSON.stringify(req)], { type: 'application/json' }));
        formData.append('file', file);

        return this.fetchingService.post(`/api/documents/`, formData, true);
    }

    delete(id: string): Observable<void> {
        return this.fetchingService.delete(`/api/documents/${id}`);
    }
}
