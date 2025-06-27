import { ClassResponse } from '../models/api/class.model';
import { CourseResponse } from '../models/api/course.model';
import { NotificationResponse } from '../models/api/notification.model';
import { SemesterResponse, SemesterWithClassesResponse } from '../models/api/semester.model';
import { BannedStudentResponse, StudentResponse } from '../models/api/student.model';
import { UserResponse } from '../models/api/user.model';
import { BannedCause } from '../models/enum/banned_cause.model';
import { NotificationType } from '../models/enum/notification.model';

export const mockUsers: UserResponse[] = [
    { id: 'ins1', fullName: 'TS. Nguyễn Văn An', email: 'nva@university.edu.vn' },
    { id: 'ins2', fullName: 'PGS. Trần Thị Bình', email: 'ttb@university.edu.vn' },
    { id: 'ins3', fullName: 'GS. Lê Văn Cường', email: 'lvc@university.edu.vn' },
    { id: 'ins4', fullName: 'TS. Phạm Thị Dung', email: 'ptd@university.edu.vn' },
    { id: 'ins5', fullName: 'ThS. Hoàng Văn Em', email: 'hve@university.edu.vn' },
    { id: 'ins6', fullName: 'TS. Đặng Thị Phương', email: 'dtp@university.edu.vn' },
    { id: 'ins7', fullName: 'PGS. Vũ Văn Giang', email: 'vvg@university.edu.vn' },
    { id: 'ins8', fullName: 'TS. Ngô Thị Hoa', email: 'nth@university.edu.vn' },
];

export const mockSemesters: SemesterResponse[] = [
    {
        id: '1',
        name: 'Học kỳ 1 năm 2024-2025',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-01-15'),
    },
    {
        id: '2',
        name: 'Học kỳ 2 năm 2024-2025',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-06-30'),
    },
    {
        id: '3',
        name: 'Học kỳ hè năm 2025',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-08-31'),
    },
];

export const mockCourses: CourseResponse[] = [
    {
        id: '1',
        name: 'Lập trình Web Frontend',
        shortDescription: 'Khóa học lập trình web frontend với HTML, CSS, JavaScript và React.',
        sessions: 12,
    },
    {
        id: '2',
        name: 'Lập trình Mobile React Native',
        shortDescription: 'Khóa học lập trình ứng dụng di động với React Native.',
        sessions: 10,
    },
    {
        id: '3',
        name: 'Thiết kế UI/UX',
        shortDescription: 'Khóa học thiết kế giao diện người dùng và trải nghiệm người dùng.',
        sessions: 8,
    },
];

export const mockClasses: ClassResponse[] = [
    {
        id: '1',
        name: 'Frontend-K1',
        room: 'Phòng 101',
        schedule: 'Sáng (7:30-11:30)',
        lecturerId: 'ins1',
        lecturerName: 'TS. Nguyễn Văn An',
        lecturerEmail: 'nguyen@gmail.com',
    },
    {
        id: '2',
        name: 'Frontend-K2',
        room: 'Phòng 102',
        schedule: 'Chiều (13:30-17:30)',
        lecturerId: 'ins2',
        lecturerName: 'PGS. Trần Thị Bình',
        lecturerEmail: 'binh@gmail.com',
    },
    {
        id: '3',
        name: 'Mobile-K1',
        room: 'Phòng 201',
        schedule: 'Tối (18:30-21:30)',
        lecturerId: 'ins3',
        lecturerName: 'GS. Lê Văn Cường',
        lecturerEmail: 'cuong@gmail.com',
    },
];

export const mockStudents: StudentResponse[] = [
    {
        id: '1',
        username: 'SV001',
        fullname: 'Nguyễn Văn An',
        email: 'nva@example.com',
        isBanned: false,
        isSelected: false,
    },
    {
        id: '2',
        username: 'SV002',
        fullname: 'Trần Thị Bình',
        email: 'ttb@example.com',
        isBanned: false,
        isSelected: false,
    },
    {
        id: '3',
        username: 'SV003',
        fullname: 'Lê Văn Cường',
        email: 'lvc@example.com',
        isBanned: false,
        isSelected: false,
    },
    {
        id: '4',
        username: 'SV004',
        fullname: 'Phạm Thị Dung',
        email: 'ptd@example.com',
        isBanned: true,
        isSelected: false,
    },
];

export const mockBannedStudents: BannedStudentResponse[] = [
    {
        code: 'SV004',
        fullname: 'Phạm Thị Dung',
        mail: 'dung@gmail.com',
        cause: BannedCause.ATTENDANCE_ISSUE,
        description: 'Thường xuyên đi muộn, không tham gia đầy đủ các hoạt động học tập',
        bannedBy: 'Admin',
        bannedDate: new Date('2023-10-01'),
    },
];

export const mockNotifications: NotificationResponse[] = [
    {
        id: '1',
        title: 'Thông báo bảo trì hệ thống',
        receiverScope: NotificationType.SYSTEM,
        content:
            '<p>Hệ thống sẽ được <strong>bảo trì</strong> vào ngày <em>15/01/2025</em> từ 22:00 đến 02:00 sáng ngày hôm sau.</p><p>Trong thời gian này, các chức năng có thể bị gián đoạn. Vui lòng hoàn thành công việc trước thời điểm trên.</p>',
        createdAt: new Date('2025-01-10T10:30:00'),
        sender: 'Admin System',
    },
    {
        id: '2',
        title: 'Hướng dẫn sử dụng tính năng mới',
        receiverScope: NotificationType.LECTURER_ONLY,
        content:
            '<p>Chúng tôi đã cập nhật <strong>tính năng chấm điểm tự động</strong> cho giảng viên.</p><ul><li>Truy cập menu "Chấm điểm"</li><li>Chọn lớp học cần chấm</li><li>Sử dụng template Excel mới</li></ul><p>Liên hệ IT nếu cần hỗ trợ.</p>',
        createdAt: new Date('2025-01-09T14:15:00'),
        sender: 'Phòng Đào Tạo',
    },
    {
        id: '3',
        title: 'Thông báo lịch thi giữa kỳ',
        receiverScope: NotificationType.STUDENT_ONLY,
        content:
            '<p><strong>Lịch thi giữa kỳ</strong> học kỳ I năm học 2024-2025:</p><p>📅 <strong>Thời gian:</strong> 20/01/2025 - 25/01/2025</p><p>📝 <strong>Hình thức:</strong> Thi trực tuyến</p><p>⏰ <strong>Thời gian làm bài:</strong> 90 phút</p><p><em>Sinh viên vui lòng chuẩn bị đầy đủ thiết bị và kết nối internet ổn định.</em></p>',
        createdAt: new Date('2025-01-08T09:00:00'),
        sender: 'Phòng Đào Tạo',
    },
    {
        id: '4',
        title: 'Cập nhật chính sách học phí',
        receiverScope: NotificationType.SYSTEM,
        content:
            '<p>Thông báo về <strong>chính sách học phí</strong> mới áp dụng từ học kỳ II:</p><p>💰 Học phí sẽ được điều chỉnh theo quy định mới</p><p>📋 Sinh viên có thể tra cứu chi tiết tại mục "Học phí"</p><p>❓ Mọi thắc mắc vui lòng liên hệ phòng Tài chính</p>',
        createdAt: new Date('2025-01-07T16:45:00'),
        sender: 'Phòng Tài Chính',
    },
    {
        id: '5',
        title: 'Workshop "Kỹ năng thuyết trình"',
        receiverScope: NotificationType.LECTURER_ONLY,
        content:
            '<p>Mời các giảng viên tham gia <strong>Workshop "Kỹ năng thuyết trình hiệu quả"</strong></p><p>🕐 <strong>Thời gian:</strong> 14:00 - 17:00, thứ Bảy 18/01/2025</p><p>📍 <strong>Địa điểm:</strong> Hội trường A1</p><p>👥 <strong>Diễn giả:</strong> TS. Nguyễn Văn A</p><p><em>Đăng ký tham gia trước 15/01/2025</em></p>',
        createdAt: new Date('2025-01-06T11:20:00'),
        sender: 'Phòng Nhân Sự',
    },
];

export const mockSemestersWithClasses: SemesterWithClassesResponse[] = [
    {
        id: '1',
        title: 'Học kỳ 1 năm 2024-2025',
        classes: mockClasses,
    },
    {
        id: '2',
        title: 'Học kỳ 2 năm 2024-2025',
        classes: mockClasses,
    },
    {
        id: '3',
        title: 'Học kỳ hè năm 2025',
        classes: mockClasses,
    },
];
