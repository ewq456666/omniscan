# OmniScan 資料層架構設計

## 1. 資料層總覽

### 1.1 資料層職責

OmniScan 的資料層負責管理應用程式的所有資料操作，包括本地儲存、遠端 API 整合、資料快取和同步機制。採用 **Repository Pattern** 作為核心設計模式，實現資料來源的抽象化。

**核心職責**：
- 本地資料持久化儲存
- 遠端 API 資料存取
- 資料快取與同步管理
- 資料模型轉換與驗證
- 離線支援與衝突解決

### 1.2 資料層架構

```
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│      (Entities & Interfaces)            │
├─────────────────────────────────────────┤
│         Repository Layer                │
│    (Data Access Abstraction)            │
├─────────────────────────────────────────┤
│         Data Sources Layer              │
│  (Local DB │ Remote API │ Cache)        │
├─────────────────────────────────────────┤
│        Infrastructure Layer            │
│   (SQLite │ HTTP Client │ File System)  │
└─────────────────────────────────────────┘
```

### 1.3 資料流向設計

**讀取資料流**：
Cache → Local DB → Remote API → Cache → Local DB → Domain

**寫入資料流**：
Domain → Repository → Local DB → Cache → Remote API (Background Sync)

## 2. 本地儲存架構

### 2.1 資料庫設計

**SQLite 資料庫選擇**：
- 輕量級嵌入式資料庫
- 支援 ACID 事務特性
- 跨平台相容性佳
- Flutter 生態系統成熟

**核心資料表設計**：

```sql
-- 掃描項目主表
scan_items:
  - id: INTEGER PRIMARY KEY
  - uuid: TEXT UNIQUE (雲端同步 ID)
  - original_image_path: TEXT
  - processed_image_path: TEXT
  - scan_type: TEXT (business_card, receipt, note, other)
  - created_at: INTEGER (timestamp)
  - updated_at: INTEGER (timestamp)
  - sync_status: TEXT (local, synced, pending, conflict)
  - metadata: TEXT (JSON)

-- 擷取資料表
extracted_data:
  - id: INTEGER PRIMARY KEY
  - scan_item_id: INTEGER (FK)
  - field_name: TEXT
  - field_value: TEXT
  - confidence: REAL
  - created_at: INTEGER

-- 標籤表
tags:
  - id: INTEGER PRIMARY KEY
  - name: TEXT UNIQUE
  - color: TEXT
  - usage_count: INTEGER
  - created_at: INTEGER

-- 項目標籤關聯表
item_tags:
  - scan_item_id: INTEGER (FK)
  - tag_id: INTEGER (FK)
  - created_at: INTEGER

-- 類別表
categories:
  - id: INTEGER PRIMARY KEY
  - name: TEXT
  - icon: TEXT
  - parent_id: INTEGER (FK, self-reference)
  - sort_order: INTEGER

-- 同步狀態表
sync_status:
  - id: INTEGER PRIMARY KEY
  - last_sync_time: INTEGER
  - sync_version: INTEGER
  - pending_changes: INTEGER
  - conflict_count: INTEGER
```

### 2.2 資料存取層設計

**DAO (Data Access Object) 模式**：
```
ScanItemDao:
  - insert(ScanItem) → Future<int>
  - update(ScanItem) → Future<void>
  - delete(int id) → Future<void>
  - findById(int id) → Future<ScanItem?>
  - findAll() → Future<List<ScanItem>>
  - findByType(ScanType) → Future<List<ScanItem>>
  - findByDateRange(DateTime start, DateTime end) → Future<List<ScanItem>>
  - search(String query) → Future<List<ScanItem>>

ExtractedDataDao:
  - insertBatch(List<ExtractedData>) → Future<void>
  - findByScanItemId(int scanItemId) → Future<List<ExtractedData>>
  - updateConfidence(int id, double confidence) → Future<void>

TagDao:
  - insert(Tag) → Future<int>
  - findAll() → Future<List<Tag>>
  - findByUsage() → Future<List<Tag>>
  - incrementUsage(int tagId) → Future<void>

CategoryDao:
  - findAll() → Future<List<Category>>
  - findByParent(int parentId) → Future<List<Category>>
```

### 2.3 檔案儲存管理

**檔案儲存策略**：
- 原始圖片：高品質保存，用於重新處理
- 壓縮圖片：顯示用途，節省儲存空間
- 快取檔案：暫時檔案，定期清理
- 備份檔案：重要資料的本地備份

**檔案組織結構**：
```
app_documents/
├── images/
│   ├── originals/        # 原始圖片
│   ├── thumbnails/       # 縮圖
│   └── compressed/       # 壓縮圖片
├── cache/
│   ├── api_responses/    # API 回應快取
│   └── temp_files/       # 暫時檔案
└── backups/
    ├── database/         # 資料庫備份
    └── settings/         # 設定備份
```

**檔案管理服務**：
```
FileManagerService:
  - saveOriginalImage(File image) → Future<String>
  - generateThumbnail(String imagePath) → Future<String>
  - compressImage(String imagePath, double quality) → Future<String>
  - deleteFile(String path) → Future<void>
  - getFileSize(String path) → Future<int>
  - cleanupTempFiles() → Future<void>
  - calculateStorageUsage() → Future<StorageInfo>
```

## 3. Repository 實現設計

### 3.1 ScanItemRepository

**介面定義**：
```
ScanItemRepository:
  - save(ScanItem item) → Future<ScanItem>
  - findById(String id) → Future<ScanItem?>
  - findAll({int limit, int offset}) → Future<List<ScanItem>>
  - search(String query) → Future<List<ScanItem>>
  - delete(String id) → Future<void>
  - getByCategory(Category category) → Future<List<ScanItem>>
  - getRecentItems(int count) → Future<List<ScanItem>>
  - syncWithRemote() → Future<SyncResult>
```

**實現策略**：
- **快取優先**: 優先從快取返回資料
- **本地回退**: 網路不可用時使用本地資料
- **背景同步**: 資料變更後自動同步到雲端
- **衝突解決**: 處理本地與遠端資料衝突

### 3.2 ProcessingRepository

**介面定義**：
```
ProcessingRepository:
  - submitForProcessing(String imagePath, ProcessingOptions options) → Future<ProcessingJob>
  - getProcessingStatus(String jobId) → Future<ProcessingStatus>
  - getProcessingResult(String jobId) → Future<ScanResult>
  - cancelProcessing(String jobId) → Future<void>
  - retryProcessing(String jobId) → Future<ProcessingJob>
```

**實現考量**：
- **狀態追蹤**: 處理狀態的即時更新
- **錯誤處理**: 網路錯誤和處理失敗的處理
- **重試機制**: 自動重試和手動重試支援
- **離線佇列**: 離線時的請求佇列管理

### 3.3 TagRepository

**介面定義**：
```
TagRepository:
  - createTag(Tag tag) → Future<Tag>
  - getAllTags() → Future<List<Tag>>
  - getPopularTags(int count) → Future<List<Tag>>
  - addTagToItem(String itemId, String tagId) → Future<void>
  - removeTagFromItem(String itemId, String tagId) → Future<void>
  - getTagsForItem(String itemId) → Future<List<Tag>>
  - searchTags(String query) → Future<List<Tag>>
```

## 4. 快取策略設計

### 4.1 多層快取架構

**記憶體快取 (L1 Cache)**：
- 最近存取的資料
- 常用的查詢結果
- UI 狀態資料
- 快取大小限制: 50MB

**磁碟快取 (L2 Cache)**：
- API 回應快取
- 圖片縮圖快取
- 搜尋結果快取
- 快取大小限制: 200MB

**資料庫快取 (L3 Cache)**：
- 完整的本地資料副本
- 離線可用的關鍵資料
- 使用者設定與偏好

### 4.2 快取更新策略

**Cache-Through Pattern**：
- 讀取時自動載入缺失資料
- 寫入時同步更新快取
- 保證資料一致性

**Cache-Aside Pattern**：
- 應用程式控制快取更新
- 更靈活的快取策略
- 適用於複雜的資料關係

**Time-Based Expiration**：
- 設定快取過期時間
- 自動清理過期資料
- 減少記憶體使用

### 4.3 快取一致性保證

**版本控制機制**：
- 資料版本號管理
- 版本不一致時自動更新
- 支援增量更新

**事件驅動更新**：
- 資料變更事件通知
- 相關快取自動失效
- 跨模組快取同步

## 5. 資料同步設計

### 5.1 同步策略

**增量同步**：
- 基於時間戳的變更檢測
- 只同步修改過的資料
- 減少網路傳輸量
- 提升同步效率

**衝突解決策略**：
- **客戶端勝出**: 客戶端修改優先
- **服務端勝出**: 服務端資料優先
- **最後修改勝出**: 基於時間戳
- **使用者選擇**: 讓使用者決定

### 5.2 同步狀態管理

**同步狀態追蹤**：
```
SyncStatus:
  - local: 僅本地存在
  - synced: 已同步
  - pending: 等待同步
  - conflict: 存在衝突
  - error: 同步錯誤
```

**同步佇列管理**：
- 優先級佇列排序
- 網路狀態適應
- 自動重試機制
- 同步進度報告

### 5.3 離線支援

**離線資料策略**：
- 關鍵資料本地快取
- 離線操作佇列
- 網路恢復後自動同步
- 離線狀態指示

**資料完整性保證**：
- 事務操作支援
- 原子性寫入
- 一致性檢查
- 錯誤回滾機制

## 6. 資料模型設計

### 6.1 領域實體模型

**ScanItem Entity**：
```
ScanItem:
  - id: String (UUID)
  - originalImagePath: String
  - processedImagePath: String?
  - scanType: ScanType
  - extractedData: Map<String, ExtractedField>
  - tags: List<Tag>
  - category: Category?
  - createdAt: DateTime
  - updatedAt: DateTime
  - syncStatus: SyncStatus
  - metadata: Map<String, dynamic>
```

**ExtractedField Entity**：
```
ExtractedField:
  - name: String
  - value: String
  - confidence: double
  - dataType: FieldDataType (text, number, date, email, phone)
  - position: Rectangle? (在圖片中的位置)
```

**Tag Entity**：
```
Tag:
  - id: String
  - name: String
  - color: Color
  - usageCount: int
  - isSystemTag: bool
  - createdAt: DateTime
```

### 6.2 資料傳輸物件 (DTO)

**API Request DTOs**：
```
ImageUploadDto:
  - imageData: String (base64)
  - imageFormat: String
  - compressionQuality: double
  - metadata: ImageMetadataDto

ProcessingRequestDto:
  - imageId: String
  - processingType: String
  - options: ProcessingOptionsDto
```

**API Response DTOs**：
```
ScanResultDto:
  - jobId: String
  - extractedData: Map<String, dynamic>
  - suggestedTags: List<String>
  - confidence: double
  - category: String
  - processingTime: int
```

### 6.3 資料轉換機制

**Entity ↔ DTO 轉換**：
- 自動化的序列化/反序列化
- 版本相容性處理
- 資料驗證與清理
- 錯誤處理與記錄

**資料庫模型轉換**：
- ORM 映射配置
- 關聯關係處理
- 查詢結果轉換
- 效能最佳化

## 7. 效能最佳化

### 7.1 查詢最佳化

**索引策略**：
- 主鍵索引
- 外鍵索引
- 複合索引 (scan_type + created_at)
- 全文檢索索引

**分頁查詢**：
- Cursor-based 分頁
- Offset-based 分頁
- 動態載入策略
- 快取分頁結果

### 7.2 記憶體管理

**物件池機制**：
- 重用常用物件
- 減少垃圾回收壓力
- 控制記憶體峰值
- 生命週期管理

**懶載入策略**：
- 按需載入關聯資料
- 延遲圖片載入
- 動態快取策略
- 記憶體壓力感知

### 7.3 儲存最佳化

**資料壓縮**：
- JSON 資料壓縮
- 圖片智慧壓縮
- 資料庫壓縮
- 傳輸壓縮

**儲存空間管理**：
- 定期清理機制
- 儲存配額管理
- 使用者通知機制
- 自動備份清理