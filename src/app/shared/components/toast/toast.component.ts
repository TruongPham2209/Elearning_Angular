import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ToastInfo, ToastService } from '../../../core/services/ui/toast.service';

@Component({
    selector: 'app-toast',
    imports: [NgbToastModule, CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: ToastInfo[] = [];
    private subscription!: Subscription;

    constructor(private toastService: ToastService) {}

    ngOnInit(): void {
        this.subscription = this.toastService.toasts$.subscribe((toast) => {
            this.toasts.push(toast);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    remove(toast: ToastInfo) {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }
}
