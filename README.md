# E-Learning Platform - Frontend

## 📖 Giới thiệu

Frontend của E-Learning Platform là ứng dụng web Single Page Application (SPA) được xây dựng với Angular 19. Ứng dụng cung cấp giao diện người dùng cho hệ thống học tập trực tuyến với 3 vai trò chính: Admin, Giảng viên (Lecturer) và Sinh viên (Student).

> **Backend Repository**: Backend Microservices nằm trong thư mục riêng biệt tại `elearning/` (Java/Spring Boot)

## 🏗️ Kiến trúc Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                   Angular Application                       │
│                     (Port 4200)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│ Admin Layout │ │   Lecturer  │ │  Web Layout  │
│              │ │   Layout    │ │  (Student)   │
└──────────────┘ └─────────────┘ └──────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────┐              ┌──────────────────┐
│ Core Services│              │  Shared Components│
│              │              │                  │
│ - API        │              │ - Footer         │
│ - Auth       │              │ - Header         │
│ - UI         │              │ - Toast          │
└──────────────┘              └──────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│      Backend Gateway (8080)         │
│   Authorization Server (8888)       │
└─────────────────────────────────────┘
```

### Cấu trúc Thư mục

```
src/
├── app/
│   ├── core/                   # Core modules (singleton services)
│   │   ├── configs/
│   │   │   └── editor.config.ts        # Rich text editor configuration
│   │   ├── interceptors/               # HTTP interceptors
│   │   ├── models/
│   │   │   ├── api/                    # API response/request models
│   │   │   ├── enum/                   # Enumerations
│   │   │   └── types/                  # TypeScript types
│   │   ├── services/
│   │   │   ├── api/                    # API services
│   │   │   │   ├── announcement.service.ts
│   │   │   │   ├── class.service.ts
│   │   │   │   ├── course.service.ts
│   │   │   │   ├── file.service.ts
│   │   │   │   ├── lession.service.ts
│   │   │   │   ├── logging.service.ts
│   │   │   │   ├── semester.service.ts
│   │   │   │   └── user.service.ts
│   │   │   ├── auth/
│   │   │   │   └── authentication.service.ts
│   │   │   └── ui/
│   │   │       └── toast.service.ts
│   │   └── utils/
│   │       ├── datetime.util.ts
│   │       ├── file.util.ts
│   │       └── mockdata.util.ts
│   ├── guards/                 # Route guards
│   │   ├── admin.guard.ts
│   │   ├── lecturer.guard.ts
│   │   ├── login.guard.ts
│   │   └── web.guard.ts
│   ├── layouts/                # Layout components
│   │   ├── admin/              # Admin dashboard layout
│   │   ├── lecturer/           # Lecturer dashboard layout
│   │   └── web/                # Student/public layout
│   ├── pages/                  # Feature pages
│   │   ├── admin/              # Admin pages
│   │   │   ├── class/
│   │   │   ├── course/
│   │   │   ├── dashboard/
│   │   │   ├── semester/
│   │   │   └── user/
│   │   ├── lecturer/           # Lecturer pages
│   │   │   ├── class/
│   │   │   ├── home/
│   │   │   └── submission/
│   │   ├── web/                # Student pages
│   │   │   ├── class/
│   │   │   └── home/
│   │   └── form/               # Auth pages
│   │       ├── login/
│   │       └── login-callback/
│   ├── routes/                 # Route configurations
│   │   ├── admin.route.ts
│   │   ├── form.route.ts
│   │   ├── lecturer.route.ts
│   │   └── web.route.ts
│   ├── shared/                 # Shared modules
│   │   ├── components/
│   │   │   ├── footer/
│   │   │   ├── header/
│   │   │   └── toast/
│   │   ├── pages/
│   │   │   └── student/        # Shared student management
│   │   ├── pipes/              # Custom pipes
│   │   └── styles/             # Shared styles
│   ├── app.component.ts        # Root component
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Main routing
├── environments/               # Environment configurations
│   ├── endpoint.env.ts         # API endpoints
│   └── oauth2.env.ts           # OAuth2 configuration
├── index.html                  # Main HTML
├── main.ts                     # Bootstrap
└── styles.scss                 # Global styles
```

## 🛠️ Công nghệ Sử dụng

### Core Technologies
- **Framework**: Angular 19.2.x
- **Language**: TypeScript 5.x
- **Build Tool**: Angular CLI 19.2.x
- **Package Manager**: npm

### UI & Styling
- **CSS Framework**: Bootstrap 5.3.x
- **Icons**: Bootstrap Icons 1.13.x
- **Responsive Design**: Mobile-first approach
- **Theme**: Custom SCSS with Bootstrap variables

### State Management & Data Flow
- **Reactive Programming**: RxJS 7.8.x
- **HTTP Client**: Angular HttpClient
- **Forms**: Angular Reactive Forms & Template-driven Forms

### Rich Features
- **Rich Text Editor**: ngx-editor 19.x (TipTap-based)
- **Charts**: ng-apexcharts 1.15.x (ApexCharts)
- **Pagination**: ngx-pagination 6.x
- **Date Picker**: @ng-bootstrap/ng-bootstrap 18.x
- **Real-time**: @stomp/stompjs 7.x (WebSocket)

### Security & Authentication
- **OAuth2**: Authorization Code Flow with PKCE
- **JWT**: jwt-decode 4.x
- **Encryption**: crypto-js 4.x

### Development Tools
- **Code Formatter**: Prettier 3.5.x
- **Testing**: Jasmine, Karma
- **Type Safety**: TypeScript strict mode

## 📋 Yêu cầu Hệ thống

- **Node.js**: 18.x hoặc cao hơn
- **npm**: 9.x hoặc cao hơn (hoặc yarn)
- **Angular CLI**: 19.2.x
- **Browser Support**:
  - Chrome (latest)
  - Firefox (latest)
  - Safari (latest)
  - Edge (latest)

## 🚀 Cài đặt và Chạy

### 1. Clone Repository

```bash
git clone https://github.com/TruongPham2209/Elearning_Spring_Boot.git
cd e-learning
```

### 2. Cài đặt Dependencies

```bash
npm install
```

### 3. Cấu hình Environment

Kiểm tra và cập nhật các file trong `src/environments/`:

**endpoint.env.ts**
```typescript
export const GATEWAY = 'http://localhost:8080';
export const AUTHORIZATION_SERVER = 'http://localhost:8888';
```

**oauth2.env.ts**
```typescript
export const config = {
    clientId: 'client',
    clientSecret: 'secret',
    redirectUri: 'http://localhost:5555/login/callback',
    scope: 'openid profile',
    responseType: 'code',
    authorizationEndpoint: `${AUTHORIZATION_SERVER}/oauth2/authorize`,
    tokenEndpoint: `${AUTHORIZATION_SERVER}/oauth2/token`,
    codeChallengeMethod: 'S256',
};
```

### 4. Chạy Development Server

```bash
npm start
# hoặc
ng serve
```

Ứng dụng sẽ chạy tại: `http://localhost:4200/`

> ⚠️ **Lưu ý**: Đảm bảo Backend services (Gateway, Authorization Server) đã được khởi động trước khi chạy Frontend.

### 5. Chạy với các Options

```bash
# Chạy với port khác
ng serve --port 4300

# Chạy và tự động mở browser
ng serve --open

# Chạy với production configuration
ng serve --configuration production
```

## 📦 Build Production

### Build cho Production

```bash
ng build --configuration production
```

Build artifacts sẽ được tạo trong thư mục `dist/`.

### Build Options

```bash
# Build với source maps
ng build --source-map

# Build và analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🧪 Testing

### Unit Tests

```bash
# Chạy unit tests
ng test

# Chạy tests một lần (CI mode)
ng test --watch=false --code-coverage
```

### End-to-End Tests

```bash
ng e2e
```

> **Note**: Bạn cần cài đặt e2e testing framework (Cypress, Playwright, etc.) trước khi chạy e2e tests.

## 🎨 Code Scaffolding

Angular CLI cung cấp các lệnh để generate code:

```bash
# Generate component
ng generate component pages/admin/new-page

# Generate service
ng generate service core/services/api/new-service

# Generate guard
ng generate guard guards/new-guard

# Generate pipe
ng generate pipe shared/pipes/new-pipe

# Generate directive
ng generate directive shared/directives/new-directive
```

## 🔐 Authentication Flow

### OAuth2 Authorization Code Flow with PKCE

1. User clicks "Login"
2. App generates code verifier and challenge
3. Redirect to Authorization Server with:
   - client_id
   - redirect_uri
   - scope
   - code_challenge
4. User authenticates on Authorization Server
5. Authorization Server redirects back with authorization code
6. App exchanges code for access token
7. Store token and redirect to appropriate dashboard

### Route Guards

- **loginGuard**: Prevents authenticated users from accessing login page
- **adminGuard**: Protects admin routes
- **lecturerGuard**: Protects lecturer routes
- **webGuard**: Protects student routes

## 🎯 Tính năng Chính

### Dành cho Admin
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý người dùng (CRUD operations)
- ✅ Quản lý khóa học và lớp học
- ✅ Quản lý học kỳ (Semester)
- ✅ Phân quyền và gán giảng viên

### Dành cho Giảng viên (Lecturer)
- ✅ Xem danh sách lớp học được phân công
- ✅ Quản lý buổi học (Lession)
- ✅ Upload và quản lý tài liệu
- ✅ Tạo và quản lý bài tập
- ✅ Đăng thông báo cho lớp học
- ✅ Chấm bài và quản lý điểm
- ✅ Xem và quản lý danh sách sinh viên

### Dành cho Sinh viên (Student)
- ✅ Dashboard với danh sách lớp học
- ✅ Xem chi tiết lớp học và buổi học
- ✅ Download tài liệu học tập
- ✅ Nộp bài tập trực tuyến
- ✅ Xem thông báo từ giảng viên
- ✅ Theo dõi tiến độ học tập
- ✅ Xem điểm và phản hồi từ giảng viên

## 📱 Responsive Design

Ứng dụng được thiết kế responsive với breakpoints:
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: > 1200px

## 🔧 Development Guidelines

### Code Style

Project sử dụng Prettier cho code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Component Structure

```typescript
@Component({
    selector: 'app-component-name',
    imports: [CommonModule, ...],
    templateUrl: './component-name.component.html',
    styleUrl: './component-name.component.scss',
})
export class ComponentNameComponent implements OnInit {
    // Properties
    // Constructor
    // Lifecycle hooks
    // Public methods
    // Private methods
}
```

### Service Structure

```typescript
@Injectable({
    providedIn: 'root',
})
export class ServiceName {
    constructor(private http: HttpClient) {}
    
    // Public methods return Observables
    getData(): Observable<DataType> {
        return this.http.get<DataType>(`${this.apiUrl}/endpoint`);
    }
}
```

## 🌐 API Integration

Tất cả API calls đi qua Gateway: `http://localhost:8080`

### Base Service

```typescript
export class BaseFetchingService {
    private readonly GATEWAY = 'http://localhost:8080';
    
    get<T>(url: string, params?: Record<string, any>): Observable<T>
    post<T>(url: string, body: any): Observable<T>
    put<T>(url: string, body: any): Observable<T>
    delete<T>(url: string): Observable<T>
}
```

### Authentication Headers

JWT token được tự động thêm vào headers bởi `AuthenticationService`:

```typescript
private getHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
}
```

## 🐛 Known Issues

- OAuth2 redirect URI phải chính xác match với configuration
- File upload có giới hạn kích thước (15MB mặc định từ backend)
- Rich text editor có thể có issues với một số browser cũ

## 🔮 Roadmap

- [ ] Implement PWA features
- [ ] Add dark mode support
- [ ] Implement real-time notifications với WebSocket
- [ ] Add video conferencing integration
- [ ] Implement drag-and-drop file upload
- [ ] Add internationalization (i18n)
- [ ] Implement advanced search và filtering
- [ ] Add data caching strategy
- [ ] Implement offline mode

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trên GitHub repository.

## 👨‍💻 Author

**Phạm Hữu Trường**
- Email: <phamtruong04112004@gmail.com>
- GitHub: [@TruongPham2209](https://github.com/TruongPham2209)

## 📄 License

This project is licensed under the MIT License.

---

**Generated with**: [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12
