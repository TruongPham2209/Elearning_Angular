import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Page } from '../../../core/models/types/page.interface';

@Component({
    selector: 'app-test',
    imports: [CommonModule, NgxPaginationModule],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
    pageData!: Page<any>;
    currentPage: number = 1;

    ngOnInit() {
        this.getPage(this.currentPage);
    }

    getPage(page: number) {
        // this.yourService.getData(page).subscribe((data) => {
        //     this.pageData = data;
        //     this.currentPage = data.currentPage;
        // });
        this.pageData = {
            content: Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`),
            totalPages: 2,
            currentPage: page,
            pageSize: 10,
        };
    }
}
