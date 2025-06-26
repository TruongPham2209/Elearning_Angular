import { CommonModule } from '@angular/common';
import { adminNavigationItems, NavigationItem } from '../../../core/models/types/navigator.interface';
import { ManagerRole } from '../../../core/models/enum/role.model';
import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

declare var bootstrap: any;

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, AfterViewInit {
    @Input() managerRole!: ManagerRole;
    @ViewChild('userDropdown', { static: true }) userDropdownElement!: ElementRef;

    navigationItems!: NavigationItem[];
    routeToHome: string = '/home';

    private dropdownInstance: any;

    ngAfterViewInit() {
        this.dropdownInstance = new bootstrap.Dropdown(this.userDropdownElement.nativeElement);
    }

    ngOnInit(): void {
        if (this.managerRole === ManagerRole.ADMIN) {
            this.routeToHome = '/admin/dashboard';
            this.navigationItems = adminNavigationItems;
            return;
        }

        if (this.managerRole === ManagerRole.LECTURER) {
            this.routeToHome = '/lecturer/home';
            return;
        }
    }

    toggleDropdown(event: MouseEvent) {
        event.preventDefault();
        this.dropdownInstance.toggle();
    }
}
