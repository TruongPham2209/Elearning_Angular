import { CommonModule } from '@angular/common';
import { adminNavigationItems, NavigationItem } from '../../../../core/models/types/navigator.interface';
import { ManagerRole } from './../../../../core/models/enum/role.model';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'manage-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.scss',
})
export class ManageHeaderComponent implements OnInit {
    @Input() managerRole!: ManagerRole;

    navigationItems!: NavigationItem[];

    ngOnInit(): void {
        if (this.managerRole === ManagerRole.ADMIN) {
            this.navigationItems = adminNavigationItems;
            return;
        }
    }
}
