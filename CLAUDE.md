# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KubeEasy is a modern Vue 3 Kubernetes dashboard application with TypeScript support. It provides a web interface for managing Kubernetes clusters, nodes, pods, services, and deployments with both mock data and real API integration capabilities.

## Key Development Commands

```bash
# Development server with hot reload
npm run dev

# Development server with different modes
npm run dev:mock      # Force mock mode enabled
npm run dev:staging   # Staging environment
npm run dev:prod      # Production environment

# Type checking only
npm run type-check

# Build for production (includes type checking via turbo)
npm run build

# Build without type checking
npm run build-only

# Lint and fix code issues
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Technology Stack

- **Frontend**: Vue 3 with Composition API and TypeScript
- **Build Tool**: Vite with modern ES modules
- **UI Framework**: VxeTable for data tables + Ant Design Vue components + Tailwind CSS for styling
- **State Management**: Pinia stores
- **Routing**: Vue Router with authentication guards
- **HTTP Client**: Axios with mock/real API switching
- **Icons**: Lucide Vue Next + Ant Design Icons + Bootstrap Icons
- **Build**: Turbo for monorepo-style build optimization

### Application Structure

The application follows a modular architecture with clear separation of concerns:

#### Core Layout System

- **App.vue**: Main layout controller with conditional rendering for login/authenticated states
- **Sidebar Component**: Navigation with hierarchical menu structure
- **Authentication Flow**: Route guards redirect unauthenticated users to login

#### Data Layer Architecture

- **Mock/API Hybrid System**: `src/services/kubernetesApi.ts` provides unified interface
- **Mock Configuration**: `src/services/config.ts` controls mock vs real API calls
- **Data Caching**: Mock data is cached and can be dynamically updated
- **Authentication Store**: Pinia store manages auth state, tokens, and localStorage persistence

#### Component Architecture

- **View Components**: Page-level components in `src/views/` for each Kubernetes resource type
- **Reusable Components**:
  - `BaseTable.vue`: TypeScript generic VxeTable wrapper with comprehensive props
  - Modal components (`BaseModal.vue`, `FormModal.vue`, `ConfirmDialog.vue`)
  - Form components (`BaseForm.vue`, `FormField.vue`)
  - `IconPicker.vue` and `IconRenderer.vue` for dynamic icon management

#### Table Implementation Standards

All data tables use VxeTable with standardized patterns:

- Consistent column definitions with proper TypeScript typing
- Unified styling via CSS `:deep()` selectors
- Standard action columns (View, Edit, Delete buttons)
- Responsive design with proper overflow handling
- Progress bars and status badges for resource metrics

### Authentication & Authorization System

**Authentication Flow**:

1. Login form captures credentials
2. `useAuthStore().login()` calls API or mock authentication
3. Success: JWT token stored in localStorage, axios headers set, user redirected
4. Route guards check authentication status on navigation
5. State persisted in localStorage with keys: `kubeasy-token`, `kubeasy-user`

**Mock Authentication**:

- Predefined credentials: `dukuan/Q_Q727585266`, `admin/admin123`, `user/user123`, `developer/dev123`
- Mock JWT tokens generated with timestamp and random components
- All mock tokens considered valid if they start with `mock-jwt-token`

**OAuth Integration**:

- OAuth login support with `loginWithOAuth()` method
- Provider-based authentication (GitHub, Google, etc.)
- Mock OAuth implementation for development testing

### Styling System

**CSS Architecture**:

- **Tailwind CSS**: Utility-first framework with custom Kubernetes color palette and typography system
- **Custom Typography**: Unified font sizes in `tailwind.config.js`: `app-xs` through `app-3xl`
- **Kubernetes Colors**: Custom color palette with `kubernetes.500` as primary blue (#326ce5)
- **Custom CSS Classes**: Unified typography classes in `src/assets/main.css`:
  - `.app-page-title`, `.app-page-subtitle`: Page-level headers
  - `.app-card-title`, `.app-modal-title`: Component-level headers
  - `.app-label`, `.app-value`: Form and data labels
- **VxeTable Styling**: Consistent `:deep()` overrides for professional appearance
- **Component Scoped Styles**: Each view uses scoped CSS for component-specific styling

### Mock Data System

**Configuration Management**:

- `MockConfigPanel.vue`: Development-only UI for toggling mock/real API calls
- `src/services/config.ts`: Centralized mock configuration with multiple configuration sources:
  - URL parameters (`?mock=true/false`) - highest priority
  - localStorage persistence (`kubeasy-mock-enabled`)
  - Environment variables (`VITE_MOCK_ENABLED`)
  - Development mode default (enabled in dev, disabled in prod)
- Global debug commands available in development: `__kubeasyMockConfig.enable()`, `__kubeasyMockConfig.disable()`, etc.

**Data Generation**:

- `src/services/mockData.ts`: Comprehensive mock data for all Kubernetes resources
- Dynamic data updates for deployment scaling, resource metrics
- Realistic API response delays for development testing

## Important Development Patterns

### Table Component Usage

When creating new tables, follow the established VxeTable pattern:

```vue
<vxe-table :data="tableData" border stripe height="500" size="small">
  <vxe-column type="checkbox" width="50"></vxe-column>
  <vxe-column type="seq" title="序号" width="60"></vxe-column>
  <!-- Data columns with custom templates -->
  <vxe-column title="操作" width="200" fixed="right">
    <template #default="{ row }">
      <div class="actions">
        <button @click="viewItem(row)" class="btn btn-info">查看</button>
        <button @click="editItem(row)" class="btn btn-primary">编辑</button>
        <button @click="deleteItem(row)" class="btn btn-danger">删除</button>
      </div>
    </template>
  </vxe-column>
</vxe-table>
```

### API Service Pattern

All API calls go through `kubernetesApi` service which automatically handles mock/real API switching:

```typescript
// Service automatically chooses mock or real API based on configuration
const clusters = await kubernetesApi.getClusters()
const pods = await kubernetesApi.getPods(namespace)
```

### Form Styling Patterns

When creating forms with consistent label alignment, follow these patterns:

**Using FormField Component (Recommended)**:

```vue
<FormField
  v-model="formData.field"
  label="Field Label"
  placeholder="Enter value"
  :inline="true"
  required
/>
```

**Custom Form Fields with Inline Layout**:
When using custom components that can't use FormField, ensure consistent styling:

```vue
<div class="form-field form-field-inline">
  <label class="text-sm font-medium text-gray-700 inline-label">Label</label>
  <div class="inline-input">
    <CustomComponent v-model="value" />
  </div>
</div>
```

**Important**: FormField component uses scoped CSS. When mixing FormField components with custom form fields in the same view, copy the form field styles to your view's scoped CSS:

```css
.form-field-inline {
  @apply flex items-start mb-4;
  gap: 12px;
}

.inline-label {
  @apply flex-shrink-0 pt-2 text-right;
  width: 80px !important;
}

.inline-input {
  @apply flex-1;
}
```

### TypeScript Interface Conventions

- Interface names use descriptive suffixes: `ClusterInfo`, `PodInfo`, `DeploymentInfo`
- All API responses have corresponding TypeScript interfaces
- Generic components use proper TypeScript generics: `T extends Record<string, any>`

## File Organization

```
src/
├── components/
│   ├── table/          # BaseTable.vue and table-related components
│   ├── modal/          # Reusable modal components
│   ├── form/           # Form-related components
│   └── icons/          # Icon components and utilities
├── services/           # API layer and mock data management
│   ├── kubernetesApi.ts # Unified API interface with mock/real switching
│   ├── config.ts       # Mock configuration management
│   ├── mockData.ts     # Comprehensive mock data generation
│   └── api.ts          # Base Axios configuration
├── stores/             # Pinia stores
│   ├── auth.ts         # Authentication store with OAuth support
│   └── counter.ts      # Example counter store
├── views/              # Page-level components
│   ├── system/         # System management views (users, roles, menus)
│   ├── HomeView.vue    # Dashboard with metrics
│   ├── *View.vue       # Kubernetes resource views (Clusters, Pods, etc.)
│   └── LoginView.vue   # Authentication interface
├── config/
│   └── menu.ts         # Menu configuration
├── hooks/              # Composable functions
│   ├── useModal.ts     # Modal management
│   └── useDrawer.ts    # Drawer management
└── assets/
    └── main.css        # Global styles and typography system
```

## Development Environment

**Node.js Requirements**: ^20.19.0 || >=22.12.0
**Package Manager**: npm (lockfile: package-lock.json)
**Dev Server**: <http://localhost:5173> (Vite default)
**Browser Requirements**: Modern browsers with ES2020+ support

## Testing Approach

The application uses mock data for development and testing:

- Toggle mock mode via the floating MockConfigPanel (development only)
- Mock authentication with predefined user credentials
- Realistic API delays and error simulation
- Dynamic mock data updates for interactive testing (e.g., deployment scaling)
