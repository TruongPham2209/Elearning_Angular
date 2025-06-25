import { CommonModule } from '@angular/common';
import { adminNavigationItems, NavigationItem } from '../../../../core/models/types/navigator.interface';
import { ManagerRole } from './../../../../core/models/enum/role.model';
import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
    selector: 'manage-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './manage.component.html',
    styleUrl: './manage.component.scss',
})
export class ManageHeaderComponent implements OnInit, AfterViewInit {
    @Input() managerRole!: ManagerRole;
    @ViewChild('userDropdown', { static: true }) userDropdownElement!: ElementRef;

    navigationItems!: NavigationItem[];

    private dropdownInstance: any;

    ngAfterViewInit() {
        this.dropdownInstance = new bootstrap.Dropdown(this.userDropdownElement.nativeElement);
    }

    ngOnInit(): void {
        if (this.managerRole === ManagerRole.ADMIN) {
            this.navigationItems = adminNavigationItems;
            return;
        }
    }

    toggleDropdown(event: MouseEvent) {
        event.preventDefault(); // Ngăn reload
        this.dropdownInstance.toggle(); // Toggle dropdown theo cách của Bootstrap
    }
}
