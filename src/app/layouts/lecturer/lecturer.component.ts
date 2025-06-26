import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ManagerRole } from '../../core/models/enum/role.model';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
    selector: 'lecturer-layout',
    imports: [CommonModule, FooterComponent, HeaderComponent, RouterOutlet],
    templateUrl: './lecturer.component.html',
    styleUrl: './lecturer.component.scss',
})
export class LecturerLayout {
    manageRole = ManagerRole.LECTURER;
}
