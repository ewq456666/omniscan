# OmniScan Development Guide - LLM Execution Manual

## Document Purpose
This document is specifically designed for LLM consumption to quickly understand project architecture and execute development tasks within limited context windows. Always read this document first when receiving development tasks to grasp the complete architecture.

## Core Project Understanding

### Application Definition
OmniScan = Intelligent Document Scanning Application
Core Flow: **Capture → Process → Organize → Insight**

### Technology Stack
```
Platform: Expo@latest (React Native)
UI: React Native Paper + Custom Component System
State: Zustand
Navigation: React Navigation v6
Data: Expo SQLite (replaceable with cloud)
Camera: Expo Camera + ImagePicker
Network: Axios (replaceable API)
```

### Architecture Layering Principles
```
presentation/ → Pure UI components, no business logic
application/ → State management, business logic coordination
infrastructure/ → External services (API/DB/Storage)
domain/ → Data models, business rules
```

## Project Architecture

### File Organization Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base components (Button, Card, Input...)
│   ├── forms/           # Form-related components
│   ├── layout/          # Layout components
│   └── business/        # Business-specific components
├── screens/             # Screen components
│   ├── capture/         # Capture-related screens
│   ├── process/         # Processing-related screens
│   ├── organize/        # Organization-related screens
│   └── insight/         # Insight-related screens
├── stores/              # Zustand state management
│   ├── captureStore.js
│   ├── processStore.js
│   ├── organizeStore.js
│   └── globalStore.js
├── services/            # External service abstraction layer
│   ├── api/            # HTTP API services
│   ├── database/       # Database services
│   └── storage/        # File storage services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React Hooks
├── constants/          # Constant definitions
└── navigation/         # Navigation configuration
```

### Four Core Modules

#### 1. Capture Module
**Responsibility**: Handle image sources (camera/gallery)
**Key Components**:
- CameraScreen: Capture interface
- ImagePickerModal: Gallery selection
- ImagePreview: Image preview

#### 2. Process Module
**Responsibility**: LLM analysis and result preview
**Key Components**:
- ProcessingScreen: Analysis progress page
- AnalysisResult: Result preview page
- ConfirmationModal: Save confirmation

#### 3. Organize Module
**Responsibility**: Data organization and search
**Key Components**:
- HomeScreen: Main dashboard
- SearchScreen: Search functionality
- CategoryList: Category browsing

#### 4. Insight Module
**Responsibility**: Item details and smart suggestions
**Key Components**:
- ItemDetailScreen: Item details
- InsightPanel: Insight suggestions
- TagManager: Tag management

## Data Flow Design

### State Management Architecture
```
Global state separation:
- captureStore: Capture state (current image, selection mode)
- processStore: Processing state (analysis progress, result data)
- organizeStore: Organization state (item list, categories, search)
- globalStore: Global state (theme, settings, user preferences)
```

### Data Model Definitions
```
ScannedItem:
- id, imageUrl, type, extractedText
- keyFields, suggestedTags, insights
- createdAt, updatedAt, category

AnalysisResult:
- type, extractedText, confidence
- keyFields, suggestedTags, insights

SearchQuery:
- keywords, filters, sortBy, dateRange
```

### Service Abstraction Layer
All external dependencies abstracted through interfaces for replaceability:
- DatabaseService: Data access abstraction
- APIService: Backend communication abstraction
- StorageService: File storage abstraction

## Modern UI Design Guidelines

### 2025 UI Trends Implementation
- **Minimalist Maximalism**: Clean layouts + Bold typography + Generous whitespace
- **Dynamic Micro-interactions**: Fluid animations + Smooth transitions + Feedback animations
- **Dark Mode**: Auto-switching + High contrast + Personalized themes
- **Passwordless Authentication**: Biometric + Magic links + Simplified flows

### Design System Organization
```
Theme Tokens:
- Color system (primary/secondary/semantic colors)
- Typography system (font family/size/weight)
- Spacing system (xs, sm, md, lg, xl, 2xl)
- Border radius system (sm, md, lg, xl, full)
- Shadow system (sm, md, lg, xl)

Component Hierarchy:
- Atomic components (Button, Input, Text)
- Molecular components (SearchBar, Card, Modal)
- Organism components (ItemList, AnalysisPanel)
```

### Responsive Strategy
- Mobile-first design (375px-428px)
- Tablet adaptation consideration (768px-1024px)
- Flexbox layout + Percentage widths
- Dynamic font sizing + Safe area adaptation

## Development Task List

### Phase 1: Foundation Setup
```
Task 1.1: Project Initialization
- Create Expo project
- Install necessary dependencies
- Configure TypeScript setup
- Establish folder structure

Task 1.2: Design System Creation
- Build theme token system
- Implement base UI component library
- Set up dark/light theme switching
- Create design guidelines

Task 1.3: Navigation Architecture
- Configure React Navigation
- Build Tab + Stack hybrid navigation
- Implement page transition animations
- Set up navigation state management

Task 1.4: State Management Setup
- Build Zustand stores structure
- Implement persistence middleware
- Set up state subscription mechanism
- Build state synchronization logic
```

### Phase 2: Service Layer Construction
```
Task 2.1: Database Service
- Design Repository interface
- Implement SQLite Repository
- Build data migration system
- Set up data model validation

Task 2.2: API Service Layer
- Design API service interface
- Implement HTTP client
- Build interceptor mechanism
- Set up error handling logic

Task 2.3: Storage Service
- Design file storage interface
- Implement local storage service
- Build image caching mechanism
- Set up cleanup strategy
```

### Phase 3: Capture Module
```
Task 3.1: Camera Functionality
- Integrate Expo Camera
- Implement capture UI components
- Add flash control
- Implement focus frame guidance

Task 3.2: Gallery Integration
- Integrate Expo ImagePicker
- Implement multi-selection functionality
- Add image preview
- Implement image preprocessing

Task 3.3: State Management
- Implement captureStore
- Build image state management
- Set up selection mode switching
- Implement state persistence
```

### Phase 4: Process Module
```
Task 4.1: LLM Analysis Integration
- Implement API call logic
- Build analysis result parsing
- Set up retry mechanism
- Implement error handling

Task 4.2: Progress Interface
- Build loading animation components
- Implement progress indicators
- Add cancellation functionality
- Set up state transitions

Task 4.3: Result Preview
- Build result display components
- Implement editing functionality
- Add confirmation flow
- Set up data validation
```

### Phase 5: Organize Module
```
Task 5.1: Home Screen Design
- Build dashboard layout
- Implement recent items display
- Add quick actions
- Set up search entry point

Task 5.2: Classification System
- Implement auto-classification logic
- Build classification management interface
- Add manual adjustment functionality
- Set up classification rules

Task 5.3: Search Functionality
- Implement full-text search
- Build filtering system
- Add sorting functionality
- Set up search history
```

### Phase 6: Insight Module
```
Task 6.1: Detail Pages
- Build item detail layout
- Implement data display components
- Add editing functionality
- Set up sharing mechanism

Task 6.2: Smart Suggestions
- Implement suggestion generation logic
- Build suggestion display components
- Add execution mechanism
- Set up feedback system

Task 6.3: Insight Analysis
- Implement trend analysis
- Build summary generation
- Add personalized recommendations
- Set up insight display
```

## LLM Usage Guidelines

### Before Starting Tasks
1. **Read This Document**: Understand complete project scope and architecture design
2. **Confirm Task Scope**: Understand specific functionality to implement
3. **Check Dependencies**: Ensure prerequisite tasks are completed
4. **Prepare Development Environment**: Ensure necessary tools and dependencies are installed

### During Task Execution
1. **Follow Architecture Layering**: Ensure code is placed in correct layers
2. **Use Abstract Interfaces**: Don't directly depend on concrete implementations
3. **Maintain Component Decoupling**: UI components contain no business logic
4. **Implement Replaceability**: Consider future expansion and switching requirements

### After Task Completion
1. **Check Architecture Consistency**: Ensure compliance with design principles
2. **Confirm Functional Completeness**: Implement all necessary features
3. **Prepare Next Task**: Understand dependencies for subsequent tasks
4. **Update Progress Status**: Mark completed task items

### Common Implementation Principles
- **UI Components**: Use design tokens, maintain consistency, consider responsiveness
- **State Management**: Use corresponding stores, avoid direct cross-module dependencies
- **Service Calls**: Through abstraction layers, facilitate testing and replacement
- **Error Handling**: Provide friendly user feedback, implement fallback strategies

### Architecture Decision Reference
- **Need Data Access**: Use Repository pattern
- **Need External API**: Use Service abstraction
- **Need State Management**: Use corresponding module store
- **Need UI Components**: Prioritize existing components, then consider creating new ones
- **Need Navigation**: Use React Navigation configuration
- **Need Theming**: Use design token system

## Extension Guidelines

### Adding New Features
1. Determine which module the feature belongs to
2. Create new components in corresponding folders
3. Update related stores and services
4. Add necessary type definitions
5. Update navigation configuration

### Switching External Services
1. Implement new service classes
2. Maintain interface consistency
3. Switch instances at application startup
4. No need to modify other code

### Modifying UI Design
1. Update design token configuration
2. Modify base component implementations
3. Keep component APIs unchanged
4. Gradually replace existing components

Remember: This document is your architecture guide and task list. Reference it every time you develop to ensure implemented code aligns with overall design philosophy.