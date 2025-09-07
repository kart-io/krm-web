# KubeEasy - Vue 3 Kubernetes Dashboard

[中文文档](./README_ZH.md) | **English Documentation**

A modern, responsive Kubernetes cluster management dashboard built with Vue 3, TypeScript, and VxeTable for professional data presentation.

## 🚀 Features

### Core Functionality
- **Real-time Dashboard**: Comprehensive cluster metrics and health monitoring
- **Multi-Cluster Management**: Support for multiple Kubernetes clusters with detailed resource tracking
- **Advanced Table Interface**: Professional data tables powered by VxeTable with sorting, filtering, and pagination
- **Resource Management**: Complete CRUD operations for pods, deployments, services, and nodes
- **Authentication System**: Secure login with JWT token management and route protection
- **Mock Data Integration**: Development-friendly mock API system with real-time data simulation

### User Interface
- **Modern Design**: Clean, intuitive interface following Kubernetes design principles
- **Responsive Layout**: Fully responsive design optimized for desktop and mobile devices
- **Professional Tables**: Standardized VxeTable implementation across all data views
- **Interactive Components**: Dynamic progress bars, status badges, and action buttons
- **Sidebar Navigation**: Hierarchical navigation with breadcrumb support

### Technical Features
- **TypeScript Support**: Full type safety with comprehensive interface definitions
- **State Management**: Pinia-based reactive state management
- **API Abstraction**: Unified API layer supporting both mock and production backends
- **Component Architecture**: Reusable component system with proper separation of concerns

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Vue 3 (Composition API), TypeScript |
| **Build System** | Vite (ES modules, fast HMR) |
| **UI Components** | VxeTable (Professional data tables) |
| **Styling** | Tailwind CSS + Custom CSS architecture |
| **State Management** | Pinia (Vue 3 native store) |
| **Routing** | Vue Router with navigation guards |
| **HTTP Client** | Axios with request/response interceptors |
| **Icons** | Lucide Vue Next (Modern icon system) |
| **Development** | ESLint, Vue DevTools, TypeScript compiler |

## 📁 Project Architecture

```
kubeasy-vue3/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── table/          # VxeTable wrapper and table utilities
│   │   ├── modal/          # Modal components (BaseModal, FormModal, etc.)
│   │   ├── form/           # Form components and field utilities
│   │   └── icons/          # Icon management components
│   ├── views/              # Page-level components
│   │   ├── system/         # System management (Users, Roles, Menus)
│   │   ├── ClustersView.vue    # Cluster management with resource metrics
│   │   ├── NodesView.vue       # Node monitoring with usage statistics
│   │   ├── PodsView.vue        # Pod management and filtering
│   │   ├── DeploymentsView.vue # Deployment scaling and management
│   │   └── ServicesView.vue    # Service discovery and networking
│   ├── services/           # API layer and data management
│   │   ├── kubernetesApi.ts    # Unified API service
│   │   ├── mockData.ts         # Mock data generation
│   │   └── config.ts           # Configuration management
│   ├── stores/             # Pinia state stores
│   │   └── auth.ts         # Authentication state management
│   ├── router/             # Vue Router configuration
│   │   └── index.ts        # Route definitions and guards
│   └── assets/             # Static assets and global styles
│       └── main.css        # Global CSS with component classes
├── public/                 # Static public assets
├── docs/                   # Documentation files
└── config files           # Vite, TypeScript, ESLint, Tailwind configs
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 20.19.0+ or 22.12.0+
- **Package Manager**: npm (recommended) or yarn
- **Browser**: Modern browser with ES2020+ support

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kubeasy-vue3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open browser and navigate to `http://localhost:5173`
   - Use development credentials to login (see Authentication section)

### Development Commands

```bash
# Development server with hot module replacement
npm run dev

# Type checking (TypeScript compilation check)
npm run type-check

# Production build with type checking
npm run build

# Production build without type checking (faster)
npm run build-only

# Code linting and auto-fix
npm run lint

# Preview production build locally
npm run preview
```

## 🔐 Authentication System

### Development Login Credentials

For development and testing, use these predefined accounts:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `dukuan` | `Q_Q727585266` | admin | Primary admin account |
| `admin` | `admin123` | admin | Standard admin access |
| `user` | `user123` | user | Regular user permissions |
| `developer` | `dev123` | developer | Developer role access |

### Authentication Flow
1. **Login Process**: Credentials validated against mock/real API
2. **Token Management**: JWT tokens stored securely in localStorage
3. **Route Protection**: Navigation guards redirect unauthenticated users
4. **Auto-logout**: Invalid/expired tokens trigger automatic logout

## 💼 Core Features Guide

### Dashboard Overview
- **Cluster Metrics**: Real-time resource utilization across all clusters
- **Health Indicators**: Status monitoring with color-coded alerts
- **Resource Summary**: CPU, memory, and node statistics
- **Interactive Charts**: Progress bars and usage visualization

### Cluster Management
- **Multi-cluster View**: Professional table interface with VxeTable
- **Resource Monitoring**: CPU/memory usage with progress indicators
- **Connection Methods**: Support for kubeconfig, tokens, and certificates
- **Cluster Actions**: View, edit, and delete operations

### Node Monitoring
- **Statistics Dashboard**: Overview cards showing total nodes, health status
- **Detailed Table View**: Comprehensive node information with usage metrics
- **Role-based Display**: Visual distinction between master and worker nodes
- **Resource Utilization**: Real-time CPU and memory usage tracking

### Pod Management
- **Namespace Filtering**: Filter pods by Kubernetes namespaces
- **Status Monitoring**: Real-time pod status with visual indicators
- **Resource Metrics**: CPU and memory consumption tracking
- **Lifecycle Management**: Complete pod lifecycle operations

### Service Discovery
- **Service Types**: Support for ClusterIP, NodePort, LoadBalancer, ExternalName
- **Port Mapping**: Detailed port configuration display
- **Endpoint Monitoring**: Real-time endpoint status tracking
- **Network Configuration**: Service networking details

### Deployment Control
- **Replica Management**: Interactive deployment scaling controls
- **Rolling Updates**: Update status monitoring and rollback capabilities
- **Image Management**: Container image information and versioning
- **Health Monitoring**: Deployment health and availability tracking

## 🎨 UI/UX Design System

### Design Principles
- **Consistency**: Unified component behavior across all views
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering for large datasets
- **Responsiveness**: Mobile-first responsive design approach

### Component Standards
- **Tables**: VxeTable with standardized column definitions and actions
- **Forms**: Consistent form layouts with validation feedback
- **Modals**: Reusable modal components for all dialog interactions
- **Navigation**: Hierarchical sidebar with breadcrumb navigation

### Color Scheme
```css
Primary Colors:
- Kubernetes Blue: #326ce5
- Success Green: #10b981
- Warning Amber: #f59e0b
- Error Red: #ef4444

Neutral Colors:
- Dark Gray: #1f2937
- Medium Gray: #6b7280
- Light Gray: #f3f4f6
```

## ⚙️ Configuration & Customization

### Mock Data Configuration
Toggle between mock and real API data using the development panel:
```typescript
// Access via floating MockConfigPanel in development
// Or programmatically:
import { mockConfig } from '@/services/config'
mockConfig.setMockEnabled(true/false)
```

### Adding New Resources
1. **Create Interface**: Define TypeScript interfaces in `services/kubernetesApi.ts`
2. **Add API Methods**: Implement API calls in `KubernetesApiService` class
3. **Create View Component**: Add new view in `src/views/` following existing patterns
4. **Update Routing**: Add route definition in `src/router/index.ts`
5. **Update Navigation**: Add menu item in sidebar navigation

### Custom Styling
- **Global Styles**: Modify `src/assets/main.css` for application-wide changes
- **Component Styles**: Use scoped CSS in individual components
- **Tailwind Configuration**: Customize `tailwind.config.js` for design system changes

## 🔧 Development Workflow

### Code Style & Standards
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code quality and consistency enforcement
- **Vue 3 Composition API**: Modern reactive programming patterns
- **Component Conventions**: Consistent naming and structure patterns

### Testing Strategy
- **Mock Data Testing**: Comprehensive mock data system for development
- **User Authentication**: Test with multiple user roles and permissions
- **API Integration**: Easy switching between mock and production APIs
- **Cross-browser Testing**: Support for all modern browsers

### Performance Optimization
- **Code Splitting**: Automatic route-based code splitting with Vite
- **Lazy Loading**: Dynamic imports for optimal bundle size
- **Table Virtualization**: Efficient handling of large datasets in tables
- **Image Optimization**: Optimized asset loading and caching

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

## 📱 Mobile Support

- **Responsive Design**: Mobile-first responsive layout
- **Touch Optimization**: Touch-friendly controls and interactions  
- **Adaptive Navigation**: Collapsible sidebar for mobile devices
- **Optimized Performance**: Efficient rendering on mobile devices

## 🤝 Contributing Guidelines

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Follow existing code patterns and conventions
4. Write comprehensive TypeScript interfaces
5. Test with both mock and real data
6. Update documentation as needed

### Commit Standards
```bash
# Commit message format
type(scope): description

# Examples:
feat(tables): add VxeTable integration to ServicesView
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
```

### Pull Request Process
1. Ensure all tests pass and TypeScript compiles
2. Update relevant documentation
3. Follow the established code review process
4. Maintain backward compatibility when possible

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kubernetes Community**: For the amazing orchestration platform
- **Vue.js Team**: For the excellent Vue 3 framework
- **VxeTable**: For the professional table component library
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite**: For the fast build tool and development experience

## 📞 Support & Community

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions
- **Documentation**: Comprehensive guides available in `/docs` directory
- **Updates**: Follow the project for latest updates and releases

---

**Built with ❤️ for the Kubernetes community**