import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Page } from '../../../core/models/types/page.interface';

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [CommonModule, MatPaginatorModule],
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
    pageData: Page<string> = {
        content: [],
        totalPages: 10,
        currentPage: 0,
        pageSize: 10,
    };

    ngOnInit() {
        this.getPage(0); // Khởi tạo trang đầu tiên (MatPaginator đếm từ 0)
    }

    getPage(page: number) {
        this.pageData = {
            content: Array.from({ length: 10 }, (_, i) => `Item ${i + 1 + page * 10}`),
            totalPages: 10,
            pageSize: 10,
            currentPage: page,
        };
    }

    onPageChange(page: number) {
        this.getPage(page - 1); // Chuyển từ đếm 1 sang đếm 0
    }

    getNextPages(): number[] {
        const current = this.pageData.currentPage + 1; // Chuyển về đếm từ 1
        const total = this.pageData.totalPages;
        const nextPages: number[] = [];
        const maxNextPages = 3;

        for (let i = current + 1; i <= Math.min(current + maxNextPages, total); i++) {
            nextPages.push(i);
        }
        return nextPages;
    }

    getLastPage(): number {
        return this.pageData.totalPages;
    }
}
