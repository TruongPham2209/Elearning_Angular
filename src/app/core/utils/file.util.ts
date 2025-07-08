import * as XLSX from 'xlsx';
import { UserRequest } from '../models/api/user.model';
import { ManagerRole } from '../models/enum/role.model';

function getCellValue(row: any[], headers: string[], columnName: string): string {
    const index = headers.indexOf(columnName);
    return index >= 0 ? (row[index] || '').toString().trim() : '';
}

function validateUserData(user: UserRequest): boolean {
    // Check required fields
    if (!user.username || !user.fullname || !user.email || !user.role) {
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        return false;
    }

    // Validate role
    if (!Object.values(ManagerRole).includes(user.role as ManagerRole)) {
        return false;
    }

    return true;
}

export function downloadTemplateUsers() {
    const headers = ['username', 'fullname', 'email', 'role'];
    const sampleData = [
        ['student001', 'Nguyễn Văn A', 'student001@example.com', 'STUDENT'],
        ['lecturer001', 'Trần Thị B', 'lecturer001@example.com', 'LECTURER'],
        ['student002', 'Lê Văn C', 'student002@example.com', 'STUDENT'],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Auto-size columns
    const colWidths = headers.map((header) => ({ wch: Math.max(header.length, 20) }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'user_import_template.xlsx');
}

export function parseExcelFileToUsers(file: File): Promise<UserRequest[]> {
    return new Promise((resolve, reject) => {
        const users: UserRequest[] = [];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    throw new Error('File Excel phải có ít nhất 2 dòng (header + data)');
                }

                const headers = jsonData[0] as string[];
                const requiredHeaders = ['username', 'fullname', 'email', 'role'];

                const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
                if (missingHeaders.length > 0) {
                    throw new Error(`Thiếu các cột: ${missingHeaders.join(', ')}`);
                }

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row.length === 0 || row.every((cell) => !cell)) continue;

                    const user: UserRequest = {
                        username: getCellValue(row, headers, 'username'),
                        fullname: getCellValue(row, headers, 'fullname'),
                        email: getCellValue(row, headers, 'email'),
                        role:
                            getCellValue(row, headers, 'role') === 'LECTURER'
                                ? ManagerRole.LECTURER
                                : ManagerRole.STUDENT,
                    };

                    if (validateUserData(user)) users.push(user);
                }

                resolve(users);
            } catch (error) {
                console.error('Lỗi khi phân tích file:', error);
                reject(error);
            }
        };

        reader.onerror = () => {
            console.error('Lỗi khi đọc file:', reader.error);
            reject(new Error('Lỗi khi đọc file'));
        };

        reader.readAsArrayBuffer(file);
    });
}

export function parseExcelFileToStudentCose(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        const usernames: Set<string> = new Set();
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    throw new Error('File Excel phải có ít nhất 2 dòng (header + data)');
                }

                const headers = jsonData[0] as string[];
                if (!headers.includes('student_code')) {
                    throw new Error('Thiếu cột "student_code" trong file Excel');
                }

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i] as any[];
                    if (row.length === 0 || row.every((cell) => !cell)) continue;

                    const studentCode = getCellValue(row, headers, 'student_code');
                    if (studentCode) {
                        usernames.add(studentCode);
                    }
                }

                resolve(Array.from(usernames));
            } catch (error) {
                console.error('Lỗi khi phân tích file:', error);
                reject(error);
            }
        };

        reader.onerror = () => {
            console.error('Lỗi khi đọc file:', reader.error);
            reject(new Error('Lỗi khi đọc file'));
        };

        reader.readAsArrayBuffer(file);
    });
}
