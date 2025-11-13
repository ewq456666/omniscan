# OmniScan MVP Development Guide

This document outlines the essential information for developing the Minimum Viable Product (MVP) of OmniScan, focusing on core functionalities and architectural consistency for an LLM agent.

## 1. System Architecture (MVP Focus)

OmniScan MVP adopts a **three-layer architecture** combined with a **feature-modularized** design. This structure ensures clear separation of concerns, promotes maintainability, and provides a scalable foundation for future development.

### 1.1 Core Architectural Principles

*   **Separation of Concerns**: Each layer and module is responsible for a distinct set of functionalities, minimizing interdependencies.
*   **Single Responsibility Principle**: Every component (module, class, function) should have one, and only one, reason to change.
*   **Dependency Inversion Principle**: High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions. This promotes loose coupling and testability.

### 1.2 System Layered Architecture

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (Pages, Widgets, Controllers)          │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│    (Services, Use Cases, Models)        │
├─────────────────────────────────────────┤
│             Data Layer                  │
│  (Repositories, API Clients, Storage)   │
└─────────────────────────────────────────┘
```

*   **Presentation Layer**: This is the user-facing layer. It is responsible for rendering the User Interface (UI), handling user input and interactions, managing UI-specific state, and orchestrating navigation flows. It communicates with the Business Logic Layer to retrieve data and trigger business operations.
*   **Business Logic Layer**: This layer encapsulates the core business rules and application logic. It defines the use cases and services that orchestrate data flow between the Presentation and Data Layers. It transforms data, applies business validations, and handles complex operations. It is agnostic to the UI and data storage mechanisms.
*   **Data Layer**: This layer is responsible for abstracting data sources. It provides a unified interface for accessing and persisting data, whether from remote APIs, local databases, or other storage mechanisms. It handles data serialization/deserialization, caching, and network communication.

### 1.3 Core Components (MVP)

These components represent key abstractions within the system, facilitating interaction between layers and modules.

*   **Camera Service**: An abstraction within the Business Logic Layer that manages interactions with the device's camera. It handles permissions, camera preview, photo capture, and basic image quality checks before passing the image data to the Processing Service.
*   **Gallery Service**: An abstraction within the Business Logic Layer for accessing the device's photo library. It manages permissions, image selection, and basic image optimization (e.g., resizing) before providing the image data to the Processing Service.
*   **API Client**: A component within the Data Layer responsible for making HTTP requests to external APIs. It handles request/response serialization, authentication token injection, and common network error handling (e.g., retries). It provides a consistent interface for all remote API interactions.
*   **Processing Service**: A Business Logic Layer component that orchestrates the image processing workflow. It receives images from Camera/Gallery Services, interacts with the Data Layer (via Image Processing Repository) to upload and track AI processing status, and retrieves the final results.
*   **Storage Repository**: An abstraction within the Data Layer that provides a unified interface for local data persistence. It manages interactions with the local database (SQLite) and file system, handling CRUD operations for scanned items and their associated data.
*   **Navigation Service**: A Presentation Layer component responsible for managing application routing and page transitions. It provides a centralized mechanism for navigating between different screens, ensuring consistent user experience.

### 1.4 Data Flow (MVP Scan Process)

This outlines the primary data flow for the core scanning functionality, demonstrating inter-layer communication.

1.  **User Input**: The user interacts with the Presentation Layer (e.g., taps a "Scan" button on the Home Page).
2.  **Initiate Capture/Selection**: The Presentation Layer invokes the Camera Service or Gallery Service (Business Logic Layer) to capture or select an image.
3.  **Image Capture/Selection**: The Camera/Gallery Service interacts with platform-specific APIs to acquire the image data.
4.  **Processing Orchestration**: The captured image is passed to the Processing Service (Business Logic Layer).
5.  **Image Upload**: The Processing Service utilizes the Image Processing Repository (Data Layer) to upload the image to the backend AI service via the API Client.
6.  **Processing Status Tracking**: The Processing Service continuously queries the Image Processing Repository for the status of the AI processing job.
7.  **Result Reception**: Once processing is complete, the Processing Service retrieves the structured scan results from the Image Processing Repository.
8.  **Local Storage**: The Processing Service then passes the scan results to the Storage Repository (Data Layer) for local persistence.
9.  **UI Update**: The Presentation Layer observes changes in the relevant state (managed by State Management) and updates the UI to display the processed results or confirm storage.

## 2. Feature Modules (MVP)

OmniScan employs a **Feature-First** modularization strategy. Each feature module is a vertical slice of the application, encompassing its own UI, business logic, and data handling, promoting independent development and clear ownership.

### 2.1 Camera Module

*   **Responsibilities**: Manages all aspects of camera interaction, including requesting and managing camera permissions, displaying the camera preview, capturing photos, and performing basic validation on the captured image (e.g., format).
*   **Internal Structure**: Typically includes `data` (repositories, datasources), `domain` (entities, use cases, interfaces), and `presentation` (pages, widgets, controllers) sub-folders.
*   **Key Interfaces**:
    *   `CameraService`: Provides a clean API for other modules to trigger camera operations (e.g., `capturePhoto()`).
    *   `PhotoCapturedEvent`: An event published when a photo is successfully captured, carrying the image data.

### 2.2 Gallery Module

*   **Responsibilities**: Handles access to the device's photo gallery, including managing gallery permissions, providing an interface for users to select images, and performing basic optimization (e.g., resizing, compression) on selected images before they are passed to other modules.
*   **Internal Structure**: Similar to the Camera Module, with `data`, `domain`, and `presentation` components specific to gallery operations.
*   **Key Interfaces**:
    *   `GalleryService`: Offers methods for picking images from the gallery (e.g., `pickImage()`).
    *   `ImageSelectedEvent`: An event published upon successful image selection, containing the selected image data.

### 2.3 Processing Module

*   **Responsibilities**: Orchestrates the entire image processing pipeline after an image is captured or selected. This includes managing the image upload progress to the backend, tracking the AI processing status, receiving and validating the processed results, and handling any errors or retries during this workflow.
*   **Internal Structure**: Contains components for API interaction (datasources), processing logic (use cases), and UI for progress display (presentation).
*   **Key Interfaces**:
    *   `ProcessingService`: Manages the processing flow (e.g., `startProcessing(image)`).
    *   `ProcessingStatusEvent`: Publishes updates on the current processing stage and progress.
    *   `ScanResultEvent`: Signals that the final scan result is ready.

### 2.4 Results Module

*   **Responsibilities**: Dedicated to displaying the results of the image scan. This involves presenting the extracted information in a structured and user-friendly format, suggesting relevant tags, allowing for user confirmation or modification of data, and triggering the action to save the results.
*   **Internal Structure**: Focuses on data formatting (use cases) and result presentation (pages, widgets).
*   **Key Interfaces**:
    *   `ResultsDisplayService`: Provides methods for rendering and interacting with scan results.
    *   `SaveConfirmedEvent`: An event indicating that the user has confirmed saving the scan results.

### 2.5 Content Module

*   **Responsibilities**: Manages the local storage and retrieval of all scanned items. This includes persisting scan results to the local database, displaying lists of items, providing basic search capabilities, and allowing users to view detailed information about each scanned item.
*   **Internal Structure**: Contains data access objects (DAOs), repositories, and presentation components for listing and viewing content.
*   **Key Interfaces**:
    *   `ContentManagementService`: Provides methods for saving, retrieving, searching, and managing scanned content.
    *   `ContentSavedEvent`: An event indicating that new content has been successfully saved.

## 3. Shared Modules (MVP)

These modules contain cross-cutting concerns and reusable components that are utilized across multiple feature modules, promoting code reuse and consistency.

### 3.1 Core Module

*   **Responsibilities**: Houses fundamental application-wide services and configurations. This includes the dependency injection container, network service encapsulation (e.g., `ApiClient`), database service initialization, and the global error handling mechanism. It provides foundational services that other modules depend on.
*   **Internal Structure**: Contains `di` (dependency injection), `network`, `storage`, `permissions`, `errors`, and `constants` sub-folders.

### 3.2 Shared Module

*   **Responsibilities**: Contains common UI components, shared data models (DTOs, entities used across features), utility functions (e.g., image manipulation, date formatting), and common business logic that doesn't belong to a specific feature.
*   **Internal Structure**: Includes `widgets`, `models`, `utils`, and `extensions` sub-folders.

## 4. API Integration (MVP)

The API integration focuses on establishing a robust and abstract interface for communicating with the backend AI processing service.

### 4.1 Image Processing API

*   **Responsibilities**: Defines the contract for interacting with the backend AI service for image analysis. This includes endpoints for uploading images, submitting processing requests, querying the status of a processing job, and retrieving the final structured results.
*   **Abstract Interface**: The `ImageProcessingRepository` in the Data Layer provides an abstraction over the concrete API implementation, allowing the Business Logic Layer to remain decoupled from the network details.
    ```
    ImageProcessingRepository:
      - uploadImage(ImageData) → UploadResult
      - submitProcessing(ProcessingRequest) → ProcessingJob
      - checkStatus(JobId) → ProcessingStatus
      - getResult(JobId) → ScanResult
    ```
*   **Error Handling**: The API integration layer is responsible for translating raw network errors into application-specific error types (e.g., `NetworkError`, `ProcessingError`) that can be handled by the Business Logic Layer. Basic retry mechanisms for transient network issues are implemented here.

### 4.2 HTTP Client Architecture

*   **Unified HTTP Client**: A single, configured HTTP client (e.g., `ApiClient` in the Core Module) is used for all API interactions. This client manages base URLs, request headers (including authentication tokens), and common request/response interceptors.
*   **Response Handling**: All API responses are standardized into a generic `ApiResponse<T>` format, which includes fields for success status, data payload, and detailed error information (`ErrorInfo`). This ensures consistent error reporting and data parsing across the application.

## 5. Data Layer (MVP)

The Data Layer provides a clean abstraction over various data sources, ensuring that the Business Logic Layer interacts with data through consistent interfaces (Repositories).

### 5.1 Local Storage

*   **Database**: SQLite is chosen for local data persistence due to its lightweight nature, ACID compliance, and strong support in mobile development environments.
*   **Core Tables**:
    *   `scan_items`: The primary table for storing metadata about each scanned document (e.g., `id`, `uuid`, `original_image_path`, `scan_type`, `created_at`, `sync_status`, `metadata`).
    *   `extracted_data`: Stores the key-value pairs of information extracted from each `scan_item` (e.g., `scan_item_id`, `field_name`, `field_value`, `confidence`).
*   **DAO Pattern**: Data Access Objects (DAOs) are implemented for each core entity (e.g., `ScanItemDao`, `ExtractedDataDao`). DAOs provide direct CRUD (Create, Read, Update, Delete) operations on the database tables, abstracting SQL queries.
*   **File Storage**: Beyond the database, the local file system is used to store larger binary assets like original and processed images. A `FileManagerService` manages file paths, saving, and retrieval.

### 5.2 Repository Implementation

Repositories act as the single source of truth for data, abstracting whether data comes from the local database, remote API, or cache.

*   **ScanItemRepository**: This repository provides methods for saving, retrieving, updating, and deleting `ScanItem` entities. For MVP, it primarily interacts with the local `ScanItemDao` and `FileManagerService`. It will eventually integrate with remote sync.
*   **ProcessingRepository**: This repository mediates between the Processing Service (Business Logic Layer) and the remote Image Processing API (via `ApiClient`). It handles submitting images for processing and fetching processing status and results.

### 5.3 Caching Strategy

Caching is implemented to improve data access performance and support offline capabilities.

*   **Multi-Layer Cache**:
    *   **Memory Cache (L1)**: Stores frequently accessed data and UI-specific state for immediate retrieval.
    *   **Disk Cache (L2)**: Persists API responses, image thumbnails, and other larger data for faster access than network requests.
*   **Update Strategy**:
    *   **Cache-Through**: Data is written directly to the cache and then to the underlying data source (e.g., database).
    *   **Cache-Aside**: The application explicitly manages reading from and writing to the cache, and then to the data source. This provides more control.

### 5.4 Data Synchronization (Basic)

For MVP, data synchronization will be basic, focusing on one-way or simple two-way sync.

*   **Incremental Sync**: Only changes (new, updated, deleted records) are synchronized, reducing network overhead. This is typically based on timestamps or version numbers.
*   **Offline Support**: Requests made while offline are queued and automatically retried when network connectivity is restored. Critical data is cached locally to allow basic functionality even without an internet connection.

## 6. State Management (MVP)

Riverpod is chosen as the primary state management solution due to its compile-time safety, strong dependency injection capabilities, and excellent testability. It facilitates a clear, unidirectional data flow.

### 6.1 Global State

Global state represents application-wide data that needs to be accessible across different features and screens.

*   **User State**: Manages the current user's authentication status, user profile information, and basic preferences. This state is typically persisted across app sessions.
*   **App Settings**: Stores application-level configurations such as theme (light/dark mode), language preferences, and other user-configurable settings. This state is also persisted.

### 6.2 Feature Module State

Each feature module manages its own encapsulated state, relevant only to that feature.

*   **Camera State**: Manages the state of the camera interface, including camera initialization status, selected camera (front/back), flash mode, and whether a capture is in progress.
*   **Processing State**: Tracks the progress and status of an ongoing image processing job, including upload percentage, AI processing progress, current step, and any associated errors.
*   **Content State**: Manages the list of scanned items displayed in the content management section, including loading status, pagination details, active search queries, and filters.

### 6.3 Page-Level State

Page-level state is specific to a single screen and typically includes UI-related state or temporary data for forms.

*   **Home Page State**: Manages the display of recent scan items, quick action buttons, and any loading indicators specific to the home screen.
*   **Results Preview State**: Manages the display and interaction with the extracted data on the results preview screen, including selected tags, category, and whether the data is in an editable mode.

## 7. UI Architecture (MVP)

The UI architecture is built on Flutter's declarative paradigm, emphasizing component reusability and a clear separation between UI presentation and business logic.

### 7.1 Design Principles

*   **Component-based**: The UI is composed of small, independent, and reusable widgets (components), promoting modularity and consistency.
*   **Responsive**: The UI adapts gracefully to different screen sizes and orientations, ensuring a consistent experience across various devices.
*   **Consistency**: A unified design language (colors, typography, spacing) is applied across the application to ensure a cohesive and predictable user experience.

### 7.2 UI Layered Architecture

```
┌─────────────────────────────────────────┐
│             Pages Layer                 │
│        (Screen-level Widgets)           │
├─────────────────────────────────────────┤
│           Widgets Layer                 │
│      (Reusable UI Components)           │
├─────────────────────────────────────────┤
│          Presentation Layer             │
│     (Controllers & State Management)    │
├─────────────────────────────────────────┤
│            Theme Layer                  │
│      (Design System & Styling)          │
└─────────────────────────────────────────┘
```

*   **Pages Layer**: These are top-level widgets that represent entire screens or major sections of the application. They compose smaller widgets and interact with the Presentation Layer (controllers/state management) to fetch data and respond to user actions.
*   **Widgets Layer**: This layer consists of smaller, reusable UI components (e.g., buttons, cards, input fields) that are agnostic to specific business logic. They receive data and callbacks via their constructors.
*   **Presentation Layer**: This layer acts as the bridge between the UI (Pages/Widgets) and the Business Logic Layer. It contains controllers or notifiers that manage the UI state, transform data for display, and handle user input by invoking use cases from the Business Logic Layer.
*   **Theme Layer**: This layer defines the application's visual design system, including color palettes, typography, spacing, and component-specific styles. It ensures visual consistency and allows for easy theming.

### 7.3 Page Designs (MVP)

These are the essential screens for the MVP, demonstrating the core user flow.

*   **Home Page**: The landing screen, displaying a list of recent scanned items, and providing prominent buttons for initiating new scans (camera or gallery import).
*   **Camera Page**: Displays the live camera feed, with controls for capturing an image and toggling flash.
*   **Processing Page**: Shows a progress indicator (e.g., percentage, spinner) while an image is being uploaded and processed by the AI backend.
*   **Results Preview Page**: Displays the captured image alongside the extracted text and other structured data. It allows for basic editing/confirmation and a prominent "Save" button.
*   **Content List Page**: A simple list view of all locally stored scanned items, allowing users to browse their documents.

### 7.4 Reusable UI Components (MVP)

These are examples of common UI components that will be built for reusability.

*   **ScanItemCard**: A widget designed to display a summary of a single scanned item in a list, including a thumbnail, title, and a brief description.
*   **ProgressIndicator**: A versatile widget to show progress for various operations (e.g., circular or linear progress bars for uploads/processing).

### 7.5 Theme Design System (Basic)

A foundational design system ensures visual consistency.

*   **Color System**: Defines the primary, secondary, and semantic color palettes (e.g., success, error, warning colors) used throughout the application.
*   **Typography System**: Specifies the font families, sizes, weights, and line heights for various text styles (e.g., headings, body text, captions).
*   **Spacing System**: Establishes a consistent set of spacing values (e.g., `xs`, `sm`, `md`, `lg`) to be used for padding, margins, and gaps between UI elements.

## 8. Error Handling (MVP)

Error handling for the MVP focuses on gracefully managing common failure scenarios and providing clear feedback to the user, while maintaining architectural integrity.

### 8.1 Error Classification

Errors are categorized by their source to facilitate targeted handling.

*   **Network Errors**: Issues related to network connectivity (e.g., no internet, timeouts, DNS failures) or HTTP communication (e.g., 4xx, 5xx responses).
*   **Processing Errors**: Failures occurring during the AI image processing workflow (e.g., unsupported image format, AI service errors, no text detected).
*   **Storage Errors**: Problems encountered during local data persistence (e.g., database write failures, insufficient storage space, file system access issues).
*   **Permission Errors**: Occur when the application lacks necessary device permissions (e.g., camera access denied, gallery access restricted).

### 8.2 Error Handling Approach

*   **Basic Recovery**: For transient errors (e.g., temporary network issues), simple retry mechanisms are implemented at the Data Layer or Business Logic Layer.
*   **Global Handling**: A centralized error handler (in the Core Module) catches unhandled exceptions and routes them to appropriate handlers or displays a generic, user-friendly error message.
*   **User Feedback**: Error messages presented to the user are concise, clear, and actionable where possible (e.g., "Check your internet connection," "Grant camera permission in settings").
*   **Layered Propagation**: Errors originate at the lowest layer (e.g., Data Layer) and are wrapped or translated into more abstract error types as they propagate up to the Business Logic Layer, and finally to the Presentation Layer for display.
