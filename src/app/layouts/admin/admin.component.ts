import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ManageFooterComponent } from '../../shared/components/footers/manage/manage.component';
import { ManageHeaderComponent } from '../../shared/components/headers/manage/manage.component';
import { ManageSidebarComponent } from '../../shared/components/sidebars/manage/manage.component';
import { RouterOutlet } from '@angular/router';
import { ManagerRole } from '../../core/models/enum/role.model';

@Component({
    selector: 'admin-layout',
    imports: [CommonModule, ManageFooterComponent, ManageHeaderComponent, ManageSidebarComponent, RouterOutlet],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
})
export class AdminLayout {
    manageRole = ManagerRole.ADMIN;
    isSidebarCollapsed = false;

    onSidebarToggle(collapsed: boolean) {
        this.isSidebarCollapsed = collapsed;
    }
}
