# KubeEasy - Vue 3 Kubernetes Dashboard

**English** | [中文文档](./README_ZH.md) | [Detailed English Docs](./README_EN.md)

A modern, responsive Kubernetes cluster management dashboard built with Vue 3, TypeScript, and VxeTable for professional data presentation.

> 🌟 **Latest Updates**: Now featuring standardized VxeTable implementation across all views with professional styling and enhanced user experience.

## 🚀 Key Features

### Core Functionality
- **📊 Real-time Dashboard**: Comprehensive cluster metrics and health monitoring
- **🏗️ Multi-cluster Management**: Professional table interface with resource tracking
- **📋 Advanced Data Tables**: VxeTable integration with sorting, filtering, and pagination
- **🔧 Resource Management**: Complete CRUD operations for K8s resources
- **🔐 Authentication System**: Secure JWT-based login with route protection
- **⚡ Mock Data Integration**: Development-friendly API system with real-time simulation

### User Experience
- **🎨 Modern Design**: Clean interface following Kubernetes design principles
- **📱 Responsive Layout**: Mobile-optimized responsive design
- **🚀 High Performance**: Optimized rendering for large datasets
- **🎯 Interactive Components**: Dynamic progress bars, status badges, and controls

## 🛠️ Technology Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Frontend** | Vue 3 (Composition API) | Modern reactive framework |
| **Language** | TypeScript | Full type safety and IntelliSense |
| **Build Tool** | Vite | Fast ES module bundling |
| **UI Components** | VxeTable | Professional data table library |
| **Styling** | Tailwind CSS + Custom CSS | Utility-first styling system |
| **State Management** | Pinia | Vue 3 native state management |
| **Routing** | Vue Router | Client-side routing with guards |
| **HTTP Client** | Axios | Promise-based API requests |
| **Icons** | Lucide Vue Next | Modern SVG icon library |

## 📦 Project Structure

```
src/
├── components/          # Reusable components
├── views/              # Page components
│   ├── HomeView.vue    # Dashboard with metrics
│   ├── ClustersView.vue # Cluster management
│   ├── PodsView.vue    # Pod monitoring
│   ├── DeploymentsView.vue # Deployment scaling
│   └── ServicesView.vue # Service discovery
├── router/             # Vue Router configuration
└── App.vue            # Main application layout
```

## 🎨 UI Components

### Dashboard
- Cluster metrics overview
- Resource usage visualization
- Health status indicators
- Interactive progress bars

### Clusters
- Multi-cluster view
- Resource utilization
- Status badges
- Detail modals

### Pods
- Namespace filtering
- Status filtering
- Resource consumption meters
- Real-time updates

### Deployments
- Replica scaling controls
- Rolling update status
- Image information
- Interactive scaling

### Services
- Service type indicators
- Port mapping display
- Endpoint monitoring
- External access status

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kubeasy-vue3
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Development Commands

```bash
# 🔥 Development server with hot module replacement
npm run dev

# 🔍 TypeScript type checking
npm run type-check

# 🏗️ Production build (with type checking)
npm run build

# ⚡ Fast build (without type checking)
npm run build-only

# 🧹 Code linting and auto-fix
npm run lint

# 👀 Preview production build
npm run preview
```

### 🔐 Authentication (Development)

| Username | Password | Role |
|----------|----------|------|
| `dukuan` | `Q_Q727585266` | Admin |
| `admin` | `admin123` | Admin |
| `user` | `user123` | User |
| `developer` | `dev123` | Developer |

## 🎯 Usage

1. **Dashboard**: View overall cluster health and metrics
2. **Clusters**: Click on cluster cards to view detailed information
3. **Pods**: Filter by namespace and status to find specific pods
4. **Deployments**: Use +/- buttons to scale deployments
5. **Services**: Monitor service endpoints and network configuration

## 🔧 Customization

### Adding New Features

1. Create new view components in `src/views/`
2. Add routes in `src/router/index.ts`
3. Update navigation in `src/App.vue`

### Styling

The application uses scoped CSS with a consistent design system:
- **Primary Color**: `#326ce5` (Kubernetes blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Data Integration

Currently uses mock data. To integrate with real Kubernetes APIs:

1. Install axios: `npm install axios`
2. Create API service files in `src/services/`
3. Replace mock data with API calls in view components
4. Add error handling and loading states

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

Fully responsive design with:
- Mobile-first approach
- Touch-friendly controls
- Collapsible navigation
- Optimized layouts for small screens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📚 Documentation

For comprehensive documentation, please refer to:

- **[English Documentation](./README_EN.md)**: Complete feature guide and technical details
- **[中文文档](./README_ZH.md)**: 完整的功能指南和技术细节
- **[CLAUDE.md](./CLAUDE.md)**: Architecture guide for AI-assisted development

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Kubernetes Community** for the amazing container orchestration platform
- **Vue.js Team** for the excellent Vue 3 framework and ecosystem
- **VxeTable** for the professional data table component library
- **Tailwind CSS** for the utility-first styling framework
- **Vite** for the lightning-fast build tool and development experience

---

**Built with ❤️ for the Kubernetes community**

![Made with Vue.js](https://img.shields.io/badge/Made%20with-Vue.js-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6?style=flat-square&logo=typescript)
![Kubernetes](https://img.shields.io/badge/For-Kubernetes-326CE5?style=flat-square&logo=kubernetes)
