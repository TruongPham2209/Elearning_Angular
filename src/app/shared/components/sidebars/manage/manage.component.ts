import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ManagerRole } from '../../../../core/models/enum/role.model';
import { adminNavigationItems, NavigationItem } from '../../../../core/models/types/navigator.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'manage-sidebar',
    imports: [CommonModule, RouterModule],
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.scss',
})
export class ManageSidebarComponent implements OnInit {
    @Input() managerRole!: ManagerRole;
    @Output() toggle = new EventEmitter<boolean>();

    isCollapsed = false;
    navigationItems!: NavigationItem[];

    ngOnInit(): void {
        if (this.managerRole === ManagerRole.ADMIN) {
            this.navigationItems = adminNavigationItems;
            return;
        }
    }

    toggleSidebar() {
        console.log('Sidebar toggled:', this.isCollapsed);
        this.isCollapsed = !this.isCollapsed;
        this.toggle.emit(this.isCollapsed);
    }
}
