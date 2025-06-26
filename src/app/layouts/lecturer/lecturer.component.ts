import { Component } from '@angular/core';
import { ManagerRole } from '../../core/models/enum/role.model';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ManageHeaderComponent } from '../../shared/components/headers/manage/manage.component';

@Component({
    selector: 'lecturer-layout',
    imports: [CommonModule, FooterComponent, ManageHeaderComponent, RouterOutlet],
    templateUrl: './lecturer.component.html',
    styleUrl: './lecturer.component.scss',
})
export class LecturerLayout {
    manageRole = ManagerRole.LECTURER;
}
