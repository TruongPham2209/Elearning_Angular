import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem, adminNavigationItems } from '../../../core/models/types/navigator.interface';

@Component({
    selector: 'admin-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './admin-sidebar.component.html',
    styleUrl: './admin-sidebar.component.scss',
})
export class AdminSidebarComponent implements OnInit {
    @Output() toggle = new EventEmitter<boolean>();

    isCollapsed = false;
    navigationItems: NavigationItem[] = adminNavigationItems;

    ngOnInit(): void {}

    toggleSidebar() {
        console.log('Sidebar toggled:', this.isCollapsed);
        this.isCollapsed = !this.isCollapsed;
        this.toggle.emit(this.isCollapsed);
    }
}
