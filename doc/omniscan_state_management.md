# OmniScan 狀態管理策略

## 1. 狀態管理總覽

### 1.1 狀態管理哲學

OmniScan 採用**分層狀態管理**策略，結合多種狀態管理模式來處理不同層級和類型的狀態。核心理念是**單一數據源**和**可預測的狀態變更**。

**核心原則**：
- **單向資料流**: 資料變更流向可預測
- **狀態隔離**: 不同層級狀態相互獨立
- **最小化狀態**: 只管理必要的狀態
- **狀態正規化**: 避免狀態重複和不一致
- **可測試性**: 狀態變更邏輯易於測試

### 1.2 狀態分層架構

```
┌─────────────────────────────────────────┐
│           Global State                  │
│    (App-wide Shared State)              │
├─────────────────────────────────────────┤
│          Feature State                  │
│    (Module-specific State)              │
├─────────────────────────────────────────┤
│           Page State                    │
│     (Screen-level State)                │
├─────────────────────────────────────────┤
│          Widget State                   │
│    (Component-level State)              │
└─────────────────────────────────────────┘
```

### 1.3 狀態管理工具選擇

**Riverpod**: 主要狀態管理解決方案
- 編譯時安全的依賴注入
- 強大的狀態組合能力
- 自動資源釋放
- 優秀的測試支援

**BLoC Pattern**: 複雜業務邏輯
- 事件驅動的狀態管理
- 清晰的狀態轉換邏輯
- 易於測試和除錯
- 支援複雜的非同步操作

**StatefulWidget**: 簡單 UI 狀態
- 組件內部狀態管理
- 動畫狀態控制
- 表單輸入狀態
- 臨時 UI 狀態

## 2. 全域狀態設計

### 2.1 使用者狀態管理

**UserState Provider**：
```
UserState:
  - currentUser: User?
  - isAuthenticated: bool
  - userPreferences: UserPreferences
  - authToken: String?
  - tokenExpiry: DateTime?

UserStateNotifier:
  - login(credentials) → Future<void>
  - logout() → Future<void>
  - refreshToken() → Future<void>
  - updatePreferences(preferences) → Future<void>
  - getCurrentUser() → User?
```

**Authentication Flow**：
1. 檢查本地儲存的認證狀態
2. 驗證 Token 有效性
3. 自動刷新過期 Token
4. 處理認證失敗情況
5. 提供統一的認證狀態

### 2.2 應用設定狀態

**AppSettingsState Provider**：
```
AppSettingsState:
  - theme: ThemeMode
  - language: Locale
  - cacheEnabled: bool
  - autoSyncEnabled: bool
  - notificationsEnabled: bool
  - imageQuality: ImageQuality
  - storageLocation: StorageLocation

AppSettingsNotifier:
  - updateTheme(theme) → Future<void>
  - updateLanguage(locale) → Future<void>
  - toggleAutoSync() → Future<void>
  - updateImageQuality(quality) → Future<void>
  - resetToDefaults() → Future<void>
```

### 2.3 同步狀態管理

**SyncState Provider**：
```
SyncState:
  - isOnline: bool
  - syncStatus: SyncStatus
  - lastSyncTime: DateTime?
  - pendingUploads: int
  - failedOperations: List<SyncError>
  - syncProgress: double

SyncStateNotifier:
  - startSync() → Future<void>
  - pauseSync() → Future<void>
  - retryFailedOperations() → Future<void>
  - clearSyncHistory() → Future<void>
  - updateNetworkStatus(isOnline) → void
```

## 3. 功能模組狀態

### 3.1 掃描功能狀態

**Camera State Management**：
```
CameraState:
  - isInitialized: bool
  - cameraController: CameraController?
  - availableCameras: List<CameraDescription>
  - selectedCamera: CameraDescription?
  - flashMode: FlashMode
  - scanType: ScanType
  - permissionStatus: PermissionStatus
  - captureInProgress: bool

CameraStateNotifier:
  - initializeCamera() → Future<void>
  - switchCamera() → Future<void>
  - toggleFlash() → Future<void>
  - setScanType(type) → void
  - capturePhoto() → Future<File>
  - disposeCamera() → Future<void>
```

**Processing State Management**：
```
ProcessingState:
  - currentJob: ProcessingJob?
  - uploadProgress: double
  - processingProgress: double
  - currentStep: ProcessingStep
  - estimatedTime: Duration?
  - error: ProcessingError?
  - canCancel: bool

ProcessingStateNotifier:
  - startProcessing(image, options) → Future<void>
  - cancelProcessing() → Future<void>
  - retryProcessing() → Future<void>
  - updateProgress(progress) → void
  - handleError(error) → void
```

### 3.2 內容管理狀態

**Content State Management**：
```
ContentState:
  - scanItems: List<ScanItem>
  - totalCount: int
  - isLoading: bool
  - hasMore: bool
  - currentPage: int
  - searchQuery: String?
  - activeFilters: FilterCriteria
  - selectedItems: Set<String>
  - sortOrder: SortOrder

ContentStateNotifier:
  - loadContent(page) → Future<void>
  - refreshContent() → Future<void>
  - searchContent(query) → Future<void>
  - applyFilters(filters) → Future<void>
  - selectItem(itemId) → void
  - deleteItems(itemIds) → Future<void>
  - exportItems(itemIds, format) → Future<void>
```

**Search State Management**：
```
SearchState:
  - query: String
  - searchResults: List<ScanItem>
  - suggestions: List<String>
  - recentSearches: List<String>
  - isSearching: bool
  - searchFilters: SearchFilters
  - resultCount: int

SearchStateNotifier:
  - performSearch(query) → Future<void>
  - saveSearch(query) → Future<void>
  - clearSearchHistory() → Future<void>
  - updateFilters(filters) → Future<void>
  - getSuggestions(query) → Future<List<String>>
```

## 4. 頁面級狀態管理

### 4.1 主頁狀態

**Home Page State**：
```
HomePageState:
  - recentScans: List<ScanItem>
  - quickStats: QuickStats
  - isRefreshing: bool
  - error: String?
  - lastRefreshTime: DateTime?

HomePageController:
  - refreshData() → Future<void>
  - navigateToScan() → void
  - navigateToItem(itemId) → void
  - handleError(error) → void
```

### 4.2 結果預覽頁面狀態

**Results Preview State**：
```
ResultsPreviewState:
  - scanResult: ScanResult
  - extractedData: Map<String, ExtractedField>
  - selectedTags: Set<Tag>
  - customTags: List<String>
  - selectedCategory: Category?
  - editMode: bool
  - saveInProgress: bool
  - validationErrors: Map<String, String>

ResultsPreviewController:
  - toggleEditMode() → void
  - updateField(fieldName, value) → void
  - addTag(tag) → void
  - removeTag(tag) → void
  - setCategory(category) → void
  - validateAndSave() → Future<bool>
  - discardChanges() → void
```

### 4.3 內容詳情頁面狀態

**Content Detail State**：
```
ContentDetailState:
  - item: ScanItem
  - isEditing: bool
  - hasChanges: bool
  - saveInProgress: bool
  - deleteInProgress: bool
  - shareInProgress: bool
  - validationErrors: Map<String, String>

ContentDetailController:
  - enterEditMode() → void
  - saveChanges() → Future<void>
  - discardChanges() → void
  - deleteItem() → Future<void>
  - shareItem(format) → Future<void>
  - exportItem(format) → Future<void>
```

## 5. 狀態組合與依賴

### 5.1 狀態組合模式

**Computed State Pattern**：
```
// 組合多個狀態來計算衍生狀態
final contentStatsProvider = Provider((ref) {
  final content = ref.watch(contentStateProvider);
  final sync = ref.watch(syncStateProvider);
  
  return ContentStats(
    totalItems: content.scanItems.length,
    syncedItems: content.scanItems.where((item) => item.isSynced).length,
    pendingItems: sync.pendingUploads,
    lastSyncTime: sync.lastSyncTime,
  );
});

// 依賴注入模式
final scanItemRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final database = ref.watch(databaseProvider);
  
  return ScanItemRepository(
    apiClient: apiClient,
    database: database,
  );
});
```

**State Listening Pattern**：
```
// 跨模組狀態監聽
final syncListenerProvider = Provider((ref) {
  ref.listen(networkStatusProvider, (previous, next) {
    if (next.isOnline && previous?.isOnline == false) {
      ref.read(syncStateProvider.notifier).startSync();
    }
  });
});
```

### 5.2 狀態持久化

**Persistent State Providers**：
```
final userPreferencesProvider = StateNotifierProvider<UserPreferencesNotifier, UserPreferences>((ref) {
  return UserPreferencesNotifier(
    storage: ref.watch(sharedPreferencesProvider),
  );
});

class UserPreferencesNotifier extends StateNotifier<UserPreferences> {
  final SharedPreferences _storage;
  
  UserPreferencesNotifier({required SharedPreferences storage}) 
    : _storage = storage,
      super(UserPreferences.fromJson(_storage.getString('user_preferences')));
  
  void updateTheme(ThemeMode theme) {
    state = state.copyWith(theme: theme);
    _saveToStorage();
  }
  
  void _saveToStorage() {
    _storage.setString('user_preferences', jsonEncode(state.toJson()));
  }
}
```

### 5.3 狀態重置與清理

**State Reset Strategies**：
```
final appStateResetProvider = Provider((ref) {
  return AppStateReset(
    resetUser: () => ref.invalidate(userStateProvider),
    resetContent: () => ref.invalidate(contentStateProvider),
    resetSync: () => ref.invalidate(syncStateProvider),
    resetAll: () {
      ref.invalidate(userStateProvider);
      ref.invalidate(contentStateProvider);
      ref.invalidate(syncStateProvider);
      ref.invalidate(appSettingsProvider);
    },
  );
});
```

## 6. 非同步狀態管理

### 6.1 非同步操作模式

**Future Provider Pattern**：
```
final scanItemsProvider = FutureProvider<List<ScanItem>>((ref) async {
  final repository = ref.watch(scanItemRepositoryProvider);
  final filters = ref.watch(contentFiltersProvider);
  
  return await repository.getScanItems(filters: filters);
});

// 錯誤處理
final scanItemsWithErrorProvider = FutureProvider<List<ScanItem>>((ref) async {
  try {
    final repository = ref.watch(scanItemRepositoryProvider);
    return await repository.getScanItems();
  } catch (error) {
    // 記錄錯誤並提供降級服務
    ref.read(errorLoggerProvider).logError(error);
    return await ref.read(localRepositoryProvider).getCachedItems();
  }
});
```

**Stream Provider Pattern**：
```
final processingStatusProvider = StreamProvider<ProcessingStatus>((ref) {
  final processingService = ref.watch(processingServiceProvider);
  final currentJob = ref.watch(currentProcessingJobProvider);
  
  if (currentJob == null) {
    return Stream.value(ProcessingStatus.idle());
  }
  
  return processingService.watchProcessingStatus(currentJob.id);
});
```

### 6.2 載入狀態管理

**AsyncValue Handling**：
```
class ContentListView extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncContent = ref.watch(scanItemsProvider);
    
    return asyncContent.when(
      data: (items) => ContentListWidget(items: items),
      loading: () => const LoadingIndicator(),
      error: (error, stack) => ErrorWidget(
        error: error,
        onRetry: () => ref.refresh(scanItemsProvider),
      ),
    );
  }
}
```

**Manual Loading State**：
```
class ProcessingPageController extends StateNotifier<ProcessingPageState> {
  ProcessingPageController(this._processingService) 
    : super(ProcessingPageState.initial());
  
  final ProcessingService _processingService;
  
  Future<void> startProcessing(File image) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final job = await _processingService.submitProcessing(image);
      state = state.copyWith(
        currentJob: job,
        isLoading: false,
      );
      
      _watchProcessingProgress(job.id);
    } catch (error) {
      state = state.copyWith(
        isLoading: false,
        error: error.toString(),
      );
    }
  }
  
  void _watchProcessingProgress(String jobId) {
    _processingService.watchProgress(jobId).listen(
      (progress) => state = state.copyWith(progress: progress),
      onError: (error) => state = state.copyWith(error: error.toString()),
    );
  }
}
```

## 7. 錯誤狀態管理

### 7.1 錯誤分類與處理

**錯誤狀態結構**：
```
abstract class AppError {
  const AppError();
}

class NetworkError extends AppError {
  final String message;
  final bool isTemporary;
  const NetworkError(this.message, {this.isTemporary = true});
}

class ProcessingError extends AppError {
  final String jobId;
  final String message;
  final bool canRetry;
  const ProcessingError(this.jobId, this.message, {this.canRetry = true});
}

class ValidationError extends AppError {
  final Map<String, String> fieldErrors;
  const ValidationError(this.fieldErrors);
}

class AuthenticationError extends AppError {
  final String message;
  final bool requiresReauth;
  const AuthenticationError(this.message, {this.requiresReauth = false});
}
```

**錯誤處理策略**：
```
class ErrorStateNotifier extends StateNotifier<ErrorState> {
  ErrorStateNotifier() : super(ErrorState.initial());
  
  void handleError(AppError error) {
    switch (error) {
      case NetworkError networkError:
        if (networkError.isTemporary) {
          _scheduleRetry();
        }
        state = state.copyWith(
          currentError: error,
          canRetry: networkError.isTemporary,
        );
        break;
        
      case ProcessingError processingError:
        state = state.copyWith(
          currentError: error,
          canRetry: processingError.canRetry,
        );
        break;
        
      case AuthenticationError authError:
        if (authError.requiresReauth) {
          _handleReauthentication();
        }
        state = state.copyWith(currentError: error);
        break;
    }
  }
  
  void clearError() {
    state = state.copyWith(currentError: null);
  }
  
  void _scheduleRetry() {
    Timer(Duration(seconds: 5), () {
      // 自動重試邏輯
    });
  }
}
```

### 7.2 全域錯誤處理

**Global Error Handler**：
```
final globalErrorHandlerProvider = Provider((ref) {
  return GlobalErrorHandler(
    onNetworkError: (error) {
      // 顯示網路錯誤提示
      ref.read(snackbarServiceProvider).showError('網路連線問題');
    },
    onAuthError: (error) {
      // 處理認證錯誤
      ref.read(authStateProvider.notifier).logout();
    },
    onProcessingError: (error) {
      // 處理處理錯誤
      ref.read(processingStateProvider.notifier).handleError(error);
    },
  );
});
```

**Error Recovery Mechanisms**：
```
class ErrorRecoveryService {
  static Future<T> withRetry<T>(
    Future<T> Function() operation, {
    int maxRetries = 3,
    Duration delay = const Duration(seconds: 1),
  }) async {
    int attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) rethrow;
        
        await Future.delayed(delay * attempts);
      }
    }
    
    throw Exception('Max retries exceeded');
  }
  
  static Future<T> withFallback<T>(
    Future<T> Function() primary,
    Future<T> Function() fallback,
  ) async {
    try {
      return await primary();
    } catch (error) {
      return await fallback();
    }
  }
}
```

## 8. 狀態測試策略

### 8.1 State Notifier 測試

**單元測試範例**：
```
class MockProcessingService extends Mock implements ProcessingService {}

void main() {
  group('ProcessingStateNotifier', () {
    late ProcessingStateNotifier notifier;
    late MockProcessingService mockService;
    
    setUp(() {
      mockService = MockProcessingService();
      notifier = ProcessingStateNotifier(mockService);
    });
    
    test('should start processing successfully', () async {
      // Arrange
      final testJob = ProcessingJob(id: 'test-id');
      when(() => mockService.submitProcessing(any()))
        .thenAnswer((_) async => testJob);
      
      // Act
      await notifier.startProcessing(File('test.jpg'));
      
      // Assert
      expect(notifier.state.currentJob, equals(testJob));
      expect(notifier.state.isLoading, isFalse);
      verify(() => mockService.submitProcessing(any())).called(1);
    });
    
    test('should handle processing error', () async {
      // Arrange
      when(() => mockService.submitProcessing(any()))
        .thenThrow(Exception('Processing failed'));
      
      // Act
      await notifier.startProcessing(File('test.jpg'));
      
      // Assert
      expect(notifier.state.error, isNotNull);
      expect(notifier.state.isLoading, isFalse);
    });
  });
}
```

### 8.2 Provider 測試

**Provider 測試範例**：
```
void main() {
  group('scanItemsProvider', () {
    test('should return scan items from repository', () async {
      // Arrange
      final container = ProviderContainer(
        overrides: [
          scanItemRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
      
      final testItems = [ScanItem(id: '1'), ScanItem(id: '2')];
      when(() => mockRepository.getScanItems())
        .thenAnswer((_) async => testItems);
      
      // Act
      final result = await container.read(scanItemsProvider.future);
      
      // Assert
      expect(result, equals(testItems));
    });
  });
}
```

### 8.3 整合測試

**狀態流整合測試**：
```
void main() {
  group('Scanning Flow Integration', () {
    testWidgets('should complete full scanning flow', (tester) async {
      // Arrange
      final container = ProviderContainer();
      
      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: MaterialApp(home: ScanningFlowPage()),
        ),
      );
      
      // Act & Assert
      // 1. 開始掃描
      await tester.tap(find.byKey(Key('scan_button')));
      await tester.pumpAndSettle();
      
      expect(container.read(cameraStateProvider).isInitialized, isTrue);
      
      // 2. 拍照
      await tester.tap(find.byKey(Key('capture_button')));
      await tester.pumpAndSettle();
      
      expect(container.read(processingStateProvider).currentJob, isNotNull);
      
      // 3. 處理完成
      container.read(processingStateProvider.notifier)
        .completeProcessing(mockResult);
      await tester.pumpAndSettle();
      
      expect(find.byType(ResultsPreviewPage), findsOneWidget);
    });
  });
}
```

## 9. 效能最佳化

### 9.1 狀態訂閱最佳化

**Selective Listening**：
```
// 只監聽需要的狀態部分
final isProcessingProvider = Provider((ref) {
  return ref.watch(processingStateProvider.select((state) => state.isLoading));
});

// 使用 family 避免不必要的重建
final scanItemProvider = Provider.family<ScanItem?, String>((ref, itemId) {
  final items = ref.watch(scanItemsProvider);
  return items.value?.firstWhere((item) => item.id == itemId);
});
```

**State Normalization**：
```
// 正規化狀態結構避免深層嵌套
class NormalizedContentState {
  final Map<String, ScanItem> items;
  final List<String> itemIds;
  final Map<String, List<String>> categorizedItems;
  
  const NormalizedContentState({
    required this.items,
    required this.itemIds,
    required this.categorizedItems,
  });
}
```

### 9.2 記憶體管理

**State Disposal**：
```
class DisposableStateNotifier<T> extends StateNotifier<T> {
  final List<StreamSubscription> _subscriptions = [];
  
  DisposableStateNotifier(T initialState) : super(initialState);
  
  void addSubscription(StreamSubscription subscription) {
    _subscriptions.add(subscription);
  }
  
  @override
  void dispose() {
    for (final subscription in _subscriptions) {
      subscription.cancel();
    }
    _subscriptions.clear();
    super.dispose();
  }
}
```

**Cache Management**：
```
final cacheManagerProvider = Provider((ref) {
  return CacheManager(
    maxSize: 100, // 最多快取 100 個項目
    ttl: Duration(minutes: 30), // 30 分鐘過期
    onEvict: (key, value) {
      // 清理相關資源
    },
  );
});
```

### 9.3 批次更新策略

**Batch State Updates**：
```
class BatchUpdateNotifier extends StateNotifier<ContentState> {
  BatchUpdateNotifier() : super(ContentState.initial());
  
  Timer? _batchTimer;
  List<StateUpdate> _pendingUpdates = [];
  
  void scheduleUpdate(StateUpdate update) {
    _pendingUpdates.add(update);
    
    _batchTimer?.cancel();
    _batchTimer = Timer(Duration(milliseconds: 16), () {
      _applyBatchUpdates();
    });
  }
  
  void _applyBatchUpdates() {
    if (_pendingUpdates.isEmpty) return;
    
    var newState = state;
    for (final update in _pendingUpdates) {
      newState = update.apply(newState);
    }
    
    state = newState;
    _pendingUpdates.clear();
  }
}
```

## 10. 狀態持久化與恢復

### 10.1 持久化策略

**State Persistence Manager**：
```
class StatePersistenceManager {
  static const String _userStateKey = 'user_state';
  static const String _appSettingsKey = 'app_settings';
  static const String _contentStateKey = 'content_state';
  
  final SharedPreferences _prefs;
  
  StatePersistenceManager(this._prefs);
  
  Future<void> saveUserState(UserState state) async {
    await _prefs.setString(_userStateKey, jsonEncode(state.toJson()));
  }
  
  UserState? loadUserState() {
    final json = _prefs.getString(_userStateKey);
    if (json != null) {
      return UserState.fromJson(jsonDecode(json));
    }
    return null;
  }
  
  Future<void> clearAllState() async {
    await _prefs.remove(_userStateKey);
    await _prefs.remove(_appSettingsKey);
    await _prefs.remove(_contentStateKey);
  }
}
```

### 10.2 狀態恢復機制

**State Restoration**：
```
class StateRestorationService {
  static Future<void> restoreAppState(WidgetRef ref) async {
    final persistenceManager = ref.read(statePersistenceManagerProvider);
    
    // 恢復使用者狀態
    final userState = persistenceManager.loadUserState();
    if (userState != null) {
      ref.read(userStateProvider.notifier).restoreState(userState);
    }
    
    // 恢復應用設定
    final appSettings = persistenceManager.loadAppSettings();
    if (appSettings != null) {
      ref.read(appSettingsProvider.notifier).restoreState(appSettings);
    }
    
    // 恢復內容狀態（僅元數據）
    final contentMetadata = persistenceManager.loadContentMetadata();
    if (contentMetadata != null) {
      ref.read(contentStateProvider.notifier).restoreMetadata(contentMetadata);
    }
  }
  
  static Future<void> saveAppState(WidgetRef ref) async {
    final persistenceManager = ref.read(statePersistenceManagerProvider);
    
    await Future.wait([
      persistenceManager.saveUserState(ref.read(userStateProvider)),
      persistenceManager.saveAppSettings(ref.read(appSettingsProvider)),
      persistenceManager.saveContentMetadata(ref.read(contentStateProvider)),
    ]);
  }
}
```

### 10.3 版本遷移

**State Migration Strategy**：
```
class StateMigrationService {
  static const int currentVersion = 3;
  
  static Future<void> migrateIfNeeded(SharedPreferences prefs) async {
    final savedVersion = prefs.getInt('state_version') ?? 1;
    
    if (savedVersion < currentVersion) {
      await _performMigration(prefs, savedVersion, currentVersion);
      await prefs.setInt('state_version', currentVersion);
    }
  }
  
  static Future<void> _performMigration(
    SharedPreferences prefs,
    int fromVersion,
    int toVersion,
  ) async {
    for (int version = fromVersion; version < toVersion; version++) {
      switch (version) {
        case 1:
          await _migrateFromV1ToV2(prefs);
          break;
        case 2:
          await _migrateFromV2ToV3(prefs);
          break;
      }
    }
  }
  
  static Future<void> _migrateFromV1ToV2(SharedPreferences prefs) async {
    // 遷移邏輯：添加新的設定欄位
    final userSettings = prefs.getString('user_settings');
    if (userSettings != null) {
      final Map<String, dynamic> settings = jsonDecode(userSettings);
      settings['autoSyncEnabled'] = true; // 新增預設值
      await prefs.setString('user_settings', jsonEncode(settings));
    }
  }
}