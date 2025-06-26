import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerRole } from '../../core/models/enum/role.model';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AdminSidebarComponent } from './../../shared/components/admin-sidebar/admin-sidebar.component';

@Component({
    selector: 'admin-layout',
    imports: [CommonModule, FooterComponent, HeaderComponent, AdminSidebarComponent, RouterOutlet],
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
