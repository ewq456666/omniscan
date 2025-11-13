# OmniScan UI 架構設計

## 1. UI 架構總覽

### 1.1 設計理念

OmniScan 的 UI 架構基於 **組件化設計** 和 **單向資料流** 原則，採用 Flutter 的現代化 UI 開發模式，確保介面的一致性、可維護性和高效能。

**核心設計原則**：
- **組件化**: 可重用的 UI 組件庫
- **響應式**: 適應不同螢幕尺寸和方向
- **無障礙**: 符合無障礙設計標準
- **效能優先**: 流暢的 60 FPS 體驗
- **一致性**: 統一的設計語言和互動模式

### 1.2 UI 分層架構

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

### 1.3 頁面導航架構

**導航結構設計**：
```
App Navigator
├── Main Tab Navigator
│   ├── Home Tab
│   │   ├── Recent Scans List
│   │   └── Quick Actions
│   ├── Search Tab
│   │   ├── Search Interface
│   │   └── Filter Options
│   └── Settings Tab
│       ├── User Preferences
│       └── App Configuration
├── Scanning Flow
│   ├── Camera Page
│   ├── Gallery Picker Page
│   ├── Processing Page
│   └── Results Preview Page
└── Content Management
    ├── Content List Page
    ├── Content Detail Page
    └── Content Edit Page
```

## 2. 頁面設計架構

### 2.1 主頁面 (Home Page)

**頁面職責**：
- 展示最近掃描項目
- 提供快速掃描入口
- 顯示應用狀態概覽
- 引導使用者使用核心功能

**UI 組件結構**：
```
HomePage:
├── AppBar
│   ├── App Title
│   ├── Search Icon
│   └── Settings Icon
├── QuickActionSection
│   ├── Scan FAB (主要動作)
│   └── Import from Gallery Button
├── RecentScansSection
│   ├── Section Header
│   ├── Recent Items List
│   │   └── ScanItemCard (複數)
│   └── View All Button
└── StatusIndicator
    ├── Sync Status
    └── Storage Usage
```

**狀態管理**：
- 最近掃描項目列表狀態
- 同步狀態指示
- 載入狀態管理
- 錯誤狀態處理

### 2.2 掃描流程頁面

**Camera Page**：
```
CameraPage:
├── Camera Preview
│   ├── Viewfinder Overlay
│   ├── Focus Indicator
│   └── Scan Guide Lines
├── Camera Controls
│   ├── Capture Button
│   ├── Flash Toggle
│   ├── Gallery Button
│   └── Cancel Button
├── Scan Type Selector
│   ├── Business Card
│   ├── Receipt
│   ├── Note
│   └── Auto Detect
└── Guidance Tips
    ├── Positioning Tips
    └── Lighting Suggestions
```

**Processing Page**：
```
ProcessingPage:
├── Progress Indicator
│   ├── Upload Progress
│   ├── Processing Progress
│   └── Estimated Time
├── Preview Image
│   └── Captured Image Display
├── Status Messages
│   ├── Current Step Description
│   └── Tips or Instructions
└── Action Buttons
    ├── Cancel Button
    └── Background Button
```

**Results Preview Page**：
```
ResultsPreviewPage:
├── Image Display
│   ├── Original Image
│   └── Zoom Controls
├── Extracted Data Section
│   ├── Data Fields List
│   │   └── ExtractedFieldCard (複數)
│   └── Edit Button
├── Tags Section
│   ├── Suggested Tags
│   ├── Custom Tag Input
│   └── Tag Selection List
├── Category Selection
│   └── Category Dropdown
└── Action Buttons
    ├── Save Button
    ├── Share Button
    └── Discard Button
```

### 2.3 內容管理頁面

**Content List Page**：
```
ContentListPage:
├── Search Bar
│   ├── Search Input
│   ├── Filter Button
│   └── Sort Options
├── Filter Panel (展開式)
│   ├── Date Range Picker
│   ├── Category Filter
│   ├── Tag Filter
│   └── Type Filter
├── Content List
│   ├── List/Grid Toggle
│   └── ContentItemCard (複數)
└── Floating Actions
    ├── Scan FAB
    └── Bulk Actions (選擇模式)
```

**Content Detail Page**：
```
ContentDetailPage:
├── Image Gallery
│   ├── Main Image View
│   ├── Zoom/Pan Support
│   └── Image Navigation
├── Extracted Data Display
│   ├── Data Fields
│   ├── Edit Mode Toggle
│   └── Copy Actions
├── Metadata Section
│   ├── Creation Date
│   ├── File Size
│   ├── Processing Info
│   └── Sync Status
├── Tags Display
│   ├── Current Tags
│   └── Add/Remove Tags
└── Action Menu
    ├── Share Options
    ├── Export Options
    ├── Delete Action
    └── Duplicate Action
```

## 3. 可重用 UI 組件

### 3.1 基礎組件

**ScanItemCard**：
```
ScanItemCard:
├── Thumbnail Image
├── Content Preview
│   ├── Title/Description
│   ├── Extract Summary
│   └── Timestamp
├── Tags Display
│   └── Tag Chips
├── Action Menu
│   ├── Quick Share
│   ├── Quick Edit
│   └── More Options
└── Status Indicators
    ├── Sync Status
    └── Processing Status
```

**ExtractedFieldCard**：
```
ExtractedFieldCard:
├── Field Label
├── Field Value
│   ├── Value Display
│   ├── Confidence Indicator
│   └── Copy Button
├── Edit Controls (編輯模式)
│   ├── Text Input
│   └── Validation Feedback
└── Action Icons
    ├── Copy Icon
    ├── Edit Icon
    └── Share Icon
```

**TagChip**：
```
TagChip:
├── Tag Text
├── Tag Color Indicator
├── Usage Count (可選)
└── Remove Button (可選)
```

**ProgressIndicator**：
```
ProgressIndicator:
├── Progress Bar/Circle
├── Percentage Text
├── Status Message
├── Estimated Time
└── Cancel Button (可選)
```

### 3.2 複合組件

**SearchInterface**：
```
SearchInterface:
├── Search Input Field
│   ├── Search Icon
│   ├── Input Text
│   ├── Clear Button
│   └── Voice Input (未來)
├── Search Suggestions
│   ├── Recent Searches
│   ├── Popular Tags
│   └── Quick Filters
├── Advanced Filters
│   ├── Date Range
│   ├── Content Type
│   ├── Confidence Level
│   └── Custom Fields
└── Search Results
    ├── Results Count
    ├── Sort Options
    └── Results List
```

**ImageViewer**：
```
ImageViewer:
├── Image Display
│   ├── Pan/Zoom Gestures
│   ├── Double Tap Zoom
│   └── Pinch to Zoom
├── Image Controls
│   ├── Zoom Reset
│   ├── Rotate Controls
│   └── Fullscreen Toggle
├── Image Info
│   ├── Resolution Display
│   ├── File Size
│   └── Capture Date
└── Action Toolbar
    ├── Share Button
    ├── Save Button
    └── Edit Button
```

**FilterPanel**：
```
FilterPanel:
├── Filter Categories
│   ├── Date Filters
│   │   ├── Today
│   │   ├── This Week
│   │   ├── This Month
│   │   └── Custom Range
│   ├── Type Filters
│   │   ├── Business Cards
│   │   ├── Receipts
│   │   ├── Notes
│   │   └── Others
│   ├── Tag Filters
│   │   └── Tag Selection List
│   └── Status Filters
│       ├── Synced
│       ├── Local Only
│       └── Pending
├── Filter Actions
│   ├── Apply Button
│   ├── Clear Button
│   └── Reset Button
└── Active Filters Display
    └── Applied Filter Chips
```

## 4. 狀態管理架構

### 4.1 狀態管理策略

**階層化狀態管理**：
- **Global State**: 使用者資訊、應用設定、同步狀態
- **Feature State**: 模組特定狀態 (掃描狀態、搜尋結果)
- **Page State**: 頁面層級狀態 (表單輸入、UI 狀態)
- **Widget State**: 組件內部狀態 (動畫、臨時狀態)

**狀態管理工具選擇**：
- **Provider/Riverpod**: 輕量級狀態管理
- **BLoC Pattern**: 複雜業務邏輯狀態
- **StatefulWidget**: 簡單組件狀態
- **ValueNotifier**: 單一值響應式更新

### 4.2 頁面狀態設計

**Home Page State**：
```
HomePageState:
  - recentScanItems: List<ScanItem>
  - isLoading: bool
  - errorMessage: String?
  - syncStatus: SyncStatus
  - storageInfo: StorageInfo
  - refreshing: bool
```

**Camera Page State**：
```
CameraPageState:
  - cameraController: CameraController?
  - isInitialized: bool
  - flashMode: FlashMode
  - captureMode: CaptureMode
  - isTakingPicture: bool
  - selectedScanType: ScanType
  - cameraPermission: PermissionStatus
```

**Processing Page State**：
```
ProcessingPageState:
  - processingJob: ProcessingJob?
  - uploadProgress: double
  - processingProgress: double
  - currentStep: ProcessingStep
  - estimatedTime: Duration?
  - canCancel: bool
  - errorInfo: ErrorInfo?
```

**Results Page State**：
```
ResultsPageState:
  - scanResult: ScanResult?
  - extractedData: Map<String, ExtractedField>
  - suggestedTags: List<Tag>
  - selectedTags: List<Tag>
  - selectedCategory: Category?
  - editMode: bool
  - saveInProgress: bool
  - validationErrors: Map<String, String>
```

### 4.3 狀態同步機制

**響應式更新**：
- 資料變更時自動更新相關 UI
- 跨頁面狀態同步
- 深層狀態變更檢測
- 最小化重建範圍

**狀態持久化**：
- 重要狀態的本地儲存
- 應用重啟後狀態恢復
- 使用者偏好設定持久化
- 暫存資料的生命週期管理

## 5. 主題設計系統

### 5.1 設計 Token 系統

**色彩系統**：
```
ColorTokens:
  Primary Colors:
    - primary: #2196F3 (主要品牌色)
    - primaryVariant: #1976D2
    - onPrimary: #FFFFFF
  
  Secondary Colors:
    - secondary: #03DAC6
    - secondaryVariant: #018786
    - onSecondary: #000000
  
  Surface Colors:
    - surface: #FFFFFF
    - background: #FAFAFA
    - error: #B00020
    - onSurface: #000000
    - onBackground: #000000
    - onError: #FFFFFF
  
  Semantic Colors:
    - success: #4CAF50
    - warning: #FF9800
    - info: #2196F3
    - neutral: #9E9E9E
```

**字體系統**：
```
TypographyTokens:
  Font Family: 'Roboto', sans-serif
  
  Headings:
    - h1: 32px, weight: 300, line-height: 40px
    - h2: 24px, weight: 400, line-height: 32px
    - h3: 20px, weight: 500, line-height: 28px
    - h4: 18px, weight: 500, line-height: 24px
    - h5: 16px, weight: 500, line-height: 22px
    - h6: 14px, weight: 500, line-height: 20px
  
  Body Text:
    - body1: 16px, weight: 400, line-height: 24px
    - body2: 14px, weight: 400, line-height: 20px
    - caption: 12px, weight: 400, line-height: 16px
  
  Interactive:
    - button: 14px, weight: 500, line-height: 20px
    - link: 14px, weight: 400, line-height: 20px, decoration: underline
```

**間距系統**：
```
SpacingTokens:
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - xxl: 48px
  
  Component Specific:
  - cardPadding: 16px
  - listItemPadding: 12px
  - buttonPadding: 12px 24px
  - inputPadding: 12px 16px
```

### 5.2 組件主題設計

**按鈕主題**：
```
ButtonThemes:
  Primary Button:
    - background: primary color
    - text: onPrimary color
    - elevation: 2dp
    - borderRadius: 8px
    - minHeight: 48dp
  
  Secondary Button:
    - background: transparent
    - text: primary color
    - border: 1px solid primary
    - borderRadius: 8px
    - minHeight: 48dp
  
  Text Button:
    - background: transparent
    - text: primary color
    - borderRadius: 8px
    - minHeight: 48dp
```

**卡片主題**：
```
CardThemes:
  Scan Item Card:
    - background: surface color
    - elevation: 1dp
    - borderRadius: 12px
    - padding: 16px
    - margin: 8px
  
  Info Card:
    - background: surface color
    - elevation: 0dp
    - border: 1px solid divider
    - borderRadius: 8px
    - padding: 12px
```

### 5.3 響應式設計

**斷點定義**：
```
Breakpoints:
  - mobile: < 600px
  - tablet: 600px - 1024px
  - desktop: > 1024px
```

**適應性佈局**：
- 手機：單欄佈局，垂直導航
- 平板：雙欄佈局，側邊導航
- 桌面：多欄佈局，頂部導航

**字體縮放**：
- 支援系統字體大小設定
- 動態字體縮放
- 可讀性最佳化
- 無障礙支援

## 6. 動畫與轉場設計

### 6.1 頁面轉場動畫

**轉場類型**：
```
PageTransitions:
  Forward Navigation:
    - type: slideFromRight
    - duration: 300ms
    - curve: easeInOut
  
  Back Navigation:
    - type: slideToRight
    - duration: 250ms
    - curve: easeIn
  
  Modal Presentation:
    - type: slideFromBottom
    - duration: 300ms
    - curve: easeOut
  
  Tab Switching:
    - type: fade
    - duration: 200ms
    - curve: easeInOut
```

### 6.2 UI 元件動畫

**載入動畫**：
- 骨架屏載入效果
- 旋轉載入指示器
- 進度條動畫
- 淡入淡出效果

**互動動畫**：
- 按鈕點擊回饋
- 卡片懸停效果
- 列表項目滑動
- 圖片縮放動畫

**狀態變化動畫**：
- 狀態切換過渡
- 錯誤提示動畫
- 成功確認動畫
- 資料更新動畫

### 6.3 手勢識別

**支援手勢**：
- 點擊 (Tap)
- 長按 (Long Press)
- 滑動 (Swipe)
- 捏合縮放 (Pinch to Zoom)
- 拖拽 (Drag)

**手勢回饋**：
- 觸覺回饋 (Haptic Feedback)
- 視覺回饋 (Visual Feedback)
- 聲音回饋 (Audio Feedback)

## 7. 無障礙設計

### 7.1 無障礙功能

**Screen Reader 支援**：
- 語義化的組件標籤
- 螢幕閱讀器友善描述
- 導航順序最佳化
- 內容結構清晰化

**視覺無障礙**：
- 高對比度模式
- 字體大小可調
- 色彩無關的資訊傳達
- 焦點指示器

**操作無障礙**：
- 鍵盤導航支援
- 最小觸控目標尺寸 (44dp)
- 手勢替代方案
- 語音控制支援

### 7.2 國際化支援

**多語言支援**：
- 文字國際化 (i18n)
- 右到左語言支援 (RTL)
- 日期時間格式本地化
- 數字格式本地化

**文化適應**：
- 色彩文化意義考量
- 圖標文化適用性
- 佈局方向適應
- 內容呈現方式調整

## 8. 效能最佳化

### 8.1 渲染效能

**Widget 最佳化**：
- const 構造函數使用
- 組件粒度控制
- 不必要重建避免
- 記憶化策略應用

**列表效能**：
- 虛擬化長列表
- 懶載入策略
- 圖片載入最佳化
- 快取複用機制

### 8.2 記憶體管理

**資源管理**：
- 圖片記憶體管理
- 動畫資源釋放
- 事件監聽器清理
- 控制器生命週期

**快取策略**：
- 圖片快取機制
- 網路回應快取
- UI 狀態快取
- 計算結果快取

### 8.3 啟動效能

**冷啟動最佳化**：
- 關鍵路徑最佳化
- 資源懶載入
- 啟動畫面設計
- 初始化順序最佳化

**暖啟動最佳化**：
- 狀態恢復策略
- 快照機制
- 預載入策略
- 背景任務管理
    