// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastInfo {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new Subject<ToastInfo>();
    toasts$ = this.toastSubject.asObservable();

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', delay = 3000) {
        this.toastSubject.next({ message, type, delay });
    }
}
