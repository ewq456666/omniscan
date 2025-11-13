# OmniScan 功能模組設計

## 1. 模組化設計理念

### 1.1 Feature-First 架構策略

OmniScan 採用 **Feature-First** 的模組組織方式，將相關功能垂直切分為獨立的功能模組，每個模組包含完整的 UI、業務邏輯和資料處理能力。

**優勢**：
- 功能邊界清晰，易於理解和維護
- 團隊可以並行開發不同功能模組
- 新功能添加不會影響現有模組
- 支援功能的增量交付和測試

### 1.2 模組邊界劃分原則

**業務邊界**：依據業務功能的自然邊界劃分
**資料邊界**：相關資料模型和操作歸屬同一模組
**UI 邊界**：相關使用者介面組合為獨立模組
**生命週期邊界**：具有相似生命週期的功能歸組

## 2. 核心功能模組

### 2.1 Camera Module (相機掃描模組)

**職責範圍**：
- 相機權限申請與管理
- 相機預覽介面控制
- 拍照功能實現
- 拍照結果處理與驗證

**內部結構**：
```
features/camera/
├── data/
│   ├── repositories/
│   │   └── camera_repository.dart
│   └── datasources/
│       └── camera_datasource.dart
├── domain/
│   ├── entities/
│   │   └── photo.dart
│   ├── repositories/
│   │   └── camera_repository_interface.dart
│   └── usecases/
│       ├── capture_photo.dart
│       └── request_permission.dart
└── presentation/
    ├── pages/
    │   └── camera_page.dart
    ├── widgets/
    │   ├── camera_preview.dart
    │   └── capture_button.dart
    └── controllers/
        └── camera_controller.dart
```

**對外介面**：
- `CameraService`: 提供拍照功能的統一介面
- `PhotoCapturedEvent`: 拍照完成事件
- `CameraPermissionStatus`: 權限狀態枚舉

**依賴關係**：
- 依賴 `core` 模組的權限管理
- 依賴 `shared` 模組的通用 UI 元件
- 對外暴露拍照結果給 `processing` 模組

### 2.2 Gallery Module (相簿匯入模組)

**職責範圍**：
- 相簿存取權限管理
- 圖片選擇介面
- 圖片格式驗證與轉換
- 圖片大小最佳化

**內部結構**：
```
features/gallery/
├── data/
│   ├── repositories/
│   │   └── gallery_repository.dart
│   └── datasources/
│       └── gallery_datasource.dart
├── domain/
│   ├── entities/
│   │   └── selected_image.dart
│   ├── repositories/
│   │   └── gallery_repository_interface.dart
│   └── usecases/
│       ├── pick_image.dart
│       └── optimize_image.dart
└── presentation/
    ├── pages/
    │   └── gallery_picker_page.dart
    ├── widgets/
    │   └── image_preview.dart
    └── controllers/
        └── gallery_controller.dart
```

**對外介面**：
- `GalleryService`: 提供圖片選擇功能
- `ImageSelectedEvent`: 圖片選擇完成事件
- `ImageOptimizationConfig`: 圖片最佳化配置

**依賴關係**：
- 依賴 `core` 模組的檔案處理功能
- 與 `camera` 模組共享圖片處理邏輯
- 輸出結果給 `processing` 模組處理

### 2.3 Processing Module (處理狀態模組)

**職責範圍**：
- 圖片上傳進度管理
- AI 處理狀態追蹤
- 處理結果接收與驗證
- 錯誤處理與重試邏輯

**內部結構**：
```
features/processing/
├── data/
│   ├── repositories/
│   │   └── processing_repository.dart
│   ├── datasources/
│   │   ├── api_datasource.dart
│   │   └── upload_datasource.dart
│   └── models/
│       ├── upload_request.dart
│       └── processing_response.dart
├── domain/
│   ├── entities/
│   │   ├── processing_status.dart
│   │   └── scan_result.dart
│   ├── repositories/
│   │   └── processing_repository_interface.dart
│   └── usecases/
│       ├── upload_image.dart
│       ├── poll_processing_status.dart
│       └── retrieve_result.dart
└── presentation/
    ├── pages/
    │   └── processing_page.dart
    ├── widgets/
    │   ├── upload_progress.dart
    │   ├── processing_indicator.dart
    │   └── retry_button.dart
    └── controllers/
        └── processing_controller.dart
```

**對外介面**：
- `ProcessingService`: 處理流程管理服務
- `ProcessingStatusEvent`: 處理狀態變更事件
- `ScanResultEvent`: 掃描結果準備就緒事件

**依賴關係**：
- 接收 `camera` 和 `gallery` 模組的圖片輸入
- 依賴 `core` 模組的網路服務
- 輸出結果給 `results` 模組展示

### 2.4 Results Module (結果展示模組)

**職責範圍**：
- 掃描結果展示與預覽
- 擷取資訊的結構化呈現
- 標籤建議與確認
- 儲存動作的觸發

**內部結構**：
```
features/results/
├── data/
│   ├── repositories/
│   │   └── results_repository.dart
│   └── models/
│       ├── extracted_data.dart
│       └── suggested_tags.dart
├── domain/
│   ├── entities/
│   │   ├── scan_result.dart
│   │   └── tag.dart
│   ├── repositories/
│   │   └── results_repository_interface.dart
│   └── usecases/
│       ├── format_extracted_data.dart
│       ├── validate_tags.dart
│       └── prepare_for_save.dart
└── presentation/
    ├── pages/
    │   └── results_preview_page.dart
    ├── widgets/
    │   ├── extracted_info_card.dart
    │   ├── tag_suggestions.dart
    │   └── save_button.dart
    └── controllers/
        └── results_controller.dart
```

**對外介面**：
- `ResultsDisplayService`: 結果展示服務
- `SaveConfirmedEvent`: 儲存確認事件
- `TagModifiedEvent`: 標籤修改事件

**依賴關係**：
- 接收 `processing` 模組的掃描結果
- 依賴 `shared` 模組的展示元件
- 觸發 `content` 模組的儲存操作

### 2.5 Content Module (內容管理模組)

**職責範圍**：
- 掃描項目的本地儲存
- 項目列表的展示與管理
- 搜尋功能實現
- 項目詳情查看

**內部結構**：
```
features/content/
├── data/
│   ├── repositories/
│   │   └── content_repository.dart
│   ├── datasources/
│   │   ├── local_datasource.dart
│   │   └── cache_datasource.dart
│   └── models/
│       ├── stored_item.dart
│       └── search_query.dart
├── domain/
│   ├── entities/
│   │   ├── content_item.dart
│   │   └── category.dart
│   ├── repositories/
│   │   └── content_repository_interface.dart
│   └── usecases/
│       ├── save_scan_result.dart
│       ├── search_content.dart
│       └── categorize_item.dart
└── presentation/
    ├── pages/
    │   ├── content_list_page.dart
    │   └── content_detail_page.dart
    ├── widgets/
    │   ├── content_item_card.dart
    │   ├── search_bar.dart
    │   └── category_filter.dart
    └── controllers/
        ├── content_list_controller.dart
        └── content_detail_controller.dart
```

**對外介面**：
- `ContentManagementService`: 內容管理服務
- `ContentSavedEvent`: 內容儲存完成事件
- `SearchResultEvent`: 搜尋結果事件

**依賴關係**：
- 接收 `results` 模組的儲存請求
- 依賴 `core` 模組的資料庫服務
- 提供資料給主頁面的「最近掃描」列表

## 3. 共享模組

### 3.1 Core Module (核心基礎模組)

**職責範圍**：
- 應用程式全域配置
- 依賴注入容器
- 網路服務封裝
- 資料庫服務
- 權限管理
- 錯誤處理

**內部結構**：
```
core/
├── di/
│   └── service_locator.dart
├── network/
│   ├── api_client.dart
│   ├── network_interceptor.dart
│   └── error_handler.dart
├── storage/
│   ├── database_service.dart
│   └── cache_service.dart
├── permissions/
│   └── permission_service.dart
├── errors/
│   ├── exceptions.dart
│   └── failures.dart
└── constants/
    ├── api_constants.dart
    └── app_constants.dart
```

### 3.2 Shared Module (共享元件模組)

**職責範圍**：
- 通用 UI 元件
- 共用的資料模型
- 工具函數
- 通用的業務邏輯

**內部結構**：
```
shared/
├── widgets/
│   ├── custom_button.dart
│   ├── loading_indicator.dart
│   ├── error_message.dart
│   └── image_display.dart
├── models/
│   ├── api_response.dart
│   └── pagination.dart
├── utils/
│   ├── image_utils.dart
│   ├── date_utils.dart
│   └── validation_utils.dart
└── extensions/
    ├── string_extensions.dart
    └── widget_extensions.dart
```

## 4. 模組間通訊機制

### 4.1 事件驅動通訊

**Event Bus Pattern**：
- 統一的事件總線管理跨模組通訊
- 模組間透過事件進行鬆耦合協作
- 支援事件的發佈、訂閱和取消訂閱

**主要事件類型**：
- `PhotoCapturedEvent`: 拍照完成
- `ImageSelectedEvent`: 圖片選擇完成
- `ProcessingStatusEvent`: 處理狀態更新
- `ScanResultEvent`: 掃描結果準備
- `ContentSavedEvent`: 內容儲存完成

### 4.2 服務層整合

**Service Provider Pattern**：
- 每個模組提供統一的服務介面
- 透過依賴注入實現服務的註冊與使用
- 服務介面定義清晰的契約邊界

**服務註冊策略**：
- 應用啟動時註冊所有模組服務
- 使用工廠模式創建服務實例
- 支援服務的懶載入和單例管理

### 4.3 資料共享機制

**Shared State Management**：
- 使用統一的狀態管理解決方案
- 定義清晰的狀態邊界和所有權
- 支援狀態的持久化和復原

**資料同步策略**：
- 明確定義資料的單一真相來源
- 實現資料變更的響應式更新
- 處理併發修改的衝突解決

## 5. 模組生命週期管理

### 5.1 初始化順序

1. **Core Module**: 首先初始化基礎服務
2. **Shared Module**: 註冊共用元件和工具
3. **Feature Modules**: 按依賴順序初始化功能模組
4. **App Initialization**: 完成應用程式啟動

### 5.2 記憶體管理

**模組級記憶體管理**：
- 每個模組負責管理自己的資源
- 實現適當的生命週期回調
- 支援模組的懶載入和卸載

**跨模組資源共享**：
- 共享資源的引用計數管理
- 避免記憶體洩漏和重複載入
- 實現有效的快取策略

### 5.3 錯誤隔離

**模組級錯誤隔離**：
- 單一模組的錯誤不影響其他模組
- 實現錯誤的邊界控制和恢復
- 提供模組級的降級服務機制