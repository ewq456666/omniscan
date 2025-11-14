# OmniScan 錯誤處理策略

## 1. 錯誤處理總覽

### 1.1 錯誤處理哲學

OmniScan 採用**多層防禦**的錯誤處理策略，確保應用程式在各種異常情況下都能提供良好的使用者體驗。核心理念是**優雅降級**和**透明恢復**。

**核心原則**：
- **預防優於修復**: 在設計階段避免潛在錯誤
- **快速失敗**: 儘早發現和報告錯誤
- **優雅降級**: 提供替代功能而非完全失效
- **透明恢復**: 自動恢復而不影響使用者體驗
- **使用者友善**: 提供清晰的錯誤資訊和解決方案

### 1.2 錯誤分層架構

```
┌─────────────────────────────────────────┐
│        Presentation Layer               │
│    (User-facing Error Messages)         │
├─────────────────────────────────────────┤
│        Application Layer                │
│     (Error Coordination & Recovery)     │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│      (Business Logic Errors)            │
├─────────────────────────────────────────┤
│      Infrastructure Layer              │
│   (Network, Storage, Platform Errors)   │
└─────────────────────────────────────────┘
```

### 1.3 錯誤分類體系

**按嚴重程度分類**：
- **Critical**: 應用崩潰或核心功能完全失效
- **Error**: 功能無法執行但應用可繼續運行
- **Warning**: 功能執行但結果可能不完整
- **Info**: 非錯誤狀況的資訊提示

**按錯誤來源分類**：
- **Network Errors**: 網路連線和 API 相關錯誤
- **Storage Errors**: 本地儲存和資料庫錯誤
- **Processing Errors**: AI 處理和業務邏輯錯誤
- **Platform Errors**: 系統平台和權限錯誤
- **User Errors**: 使用者輸入和操作錯誤

## 2. 錯誤類型定義

### 2.1 基礎錯誤類型

**Base Error Classes**：
```
abstract class AppError implements Exception {
  final String message;
  final String? code;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;
  
  const AppError({
    required this.message,
    this.code,
    DateTime? timestamp,
    this.metadata,
  }) : timestamp = timestamp ?? DateTime.now();
  
  String get userMessage => message;
  bool get canRetry => false;
  bool get shouldLog => true;
  ErrorSeverity get severity => ErrorSeverity.error;
}

enum ErrorSeverity { info, warning, error, critical }
```

### 2.2 網路錯誤

**Network Error Types**：
```
class NetworkError extends AppError {
  final int? statusCode;
  final String? endpoint;
  
  const NetworkError({
    required String message,
    this.statusCode,
    this.endpoint,
    String? code,
    Map<String, dynamic>? metadata,
  }) : super(message: message, code: code, metadata: metadata);
  
  @override
  bool get canRetry => statusCode == null || statusCode! >= 500;
  
  @override
  String get userMessage {
    if (statusCode == 404) return '請求的資源不存在';
    if (statusCode == 401) return '認證已過期，請重新登入';
    if (statusCode == 403) return '沒有權限執行此操作';
    if (statusCode != null && statusCode! >= 500) return '伺服器暫時無法處理請求';
    return '網路連線發生問題';
  }
}

class ConnectionError extends NetworkError {
  const ConnectionError({String? endpoint}) 
    : super(
        message: 'Unable to connect to server',
        code: 'CONNECTION_ERROR',
        endpoint: endpoint,
      );
  
  @override
  String get userMessage => '無法連接到伺服器，請檢查網路連線';
  
  @override
  bool get canRetry => true;
}

class TimeoutError extends NetworkError {
  final Duration timeout;
  
  const TimeoutError({
    required this.timeout,
    String? endpoint,
  }) : super(
        message: 'Request timeout after ${timeout.inSeconds} seconds',
        code: 'TIMEOUT_ERROR',
        endpoint: endpoint,
      );
  
  @override
  String get userMessage => '請求逾時，請稍後再試';
  
  @override
  bool get canRetry => true;
}
```

### 2.3 處理錯誤

**Processing Error Types**：
```
class ProcessingError extends AppError {
  final String? jobId;
  final ProcessingStage stage;
  final double? progress;
  
  const ProcessingError({
    required String message,
    this.jobId,
    required this.stage,
    this.progress,
    String? code,
  }) : super(message: message, code: code);
  
  @override
  bool get canRetry => stage != ProcessingStage.validation;
  
  @override
  String get userMessage {
    switch (stage) {
      case ProcessingStage.upload:
        return '圖片上傳失敗';
      case ProcessingStage.processing:
        return 'AI 處理過程發生錯誤';
      case ProcessingStage.extraction:
        return '資料擷取失敗';
      case ProcessingStage.validation:
        return '處理結果驗證失敗';
    }
  }
}

enum ProcessingStage { upload, processing, extraction, validation }

class ImageProcessingError extends ProcessingError {
  final ImageErrorType imageErrorType;
  
  const ImageProcessingError({
    required String message,
    required this.imageErrorType,
    String? jobId,
  }) : super(
        message: message,
        jobId: jobId,
        stage: ProcessingStage.processing,
        code: 'IMAGE_PROCESSING_ERROR',
      );
  
  @override
  String get userMessage {
    switch (imageErrorType) {
      case ImageErrorType.unsupportedFormat:
        return '不支援的圖片格式';
      case ImageErrorType.tooLarge:
        return '圖片檔案過大';
      case ImageErrorType.poorQuality:
        return '圖片品質不佳，請重新拍攝';
      case ImageErrorType.noTextDetected:
        return '圖片中未偵測到文字內容';
    }
  }
  
  @override
  bool get canRetry => imageErrorType == ImageErrorType.poorQuality;
}

enum ImageErrorType { unsupportedFormat, tooLarge, poorQuality, noTextDetected }
```

### 2.4 儲存錯誤

**Storage Error Types**：
```
class StorageError extends AppError {
  final StorageType storageType;
  final String? operation;
  
  const StorageError({
    required String message,
    required this.storageType,
    this.operation,
    String? code,
  }) : super(message: message, code: code);
  
  @override
  String get userMessage {
    switch (storageType) {
      case StorageType.database:
        return '資料庫操作失敗';
      case StorageType.fileSystem:
        return '檔案儲存失敗';
      case StorageType.cache:
        return '快取操作失敗';
    }
  }
}

enum StorageType { database, fileSystem, cache }

class InsufficientStorageError extends StorageError {
  final int requiredSpace;
  final int availableSpace;
  
  const InsufficientStorageError({
    required this.requiredSpace,
    required this.availableSpace,
  }) : super(
        message: 'Insufficient storage space',
        storageType: StorageType.fileSystem,
        code: 'INSUFFICIENT_STORAGE',
      );
  
  @override
  String get userMessage => '儲存空間不足，需要 ${_formatBytes(requiredSpace)}，剩餘 ${_formatBytes(availableSpace)}';
  
  String _formatBytes(int bytes) {
    if (bytes < 1024) return '${bytes}B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)}KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)}MB';
  }
}
```

### 2.5 平台錯誤

**Platform Error Types**：
```
class PlatformError extends AppError {
  final PlatformFeature feature;
  
  const PlatformError({
    required String message,
    required this.feature,
    String? code,
  }) : super(message: message, code: code);
  
  @override
  String get userMessage {
    switch (feature) {
      case PlatformFeature.camera:
        return '無法存取相機';
      case PlatformFeature.gallery:
        return '無法存取相簿';
      case PlatformFeature.storage:
        return '無法存取儲存空間';
      case PlatformFeature.network:
        return '網路功能不可用';
    }
  }
}

enum PlatformFeature { camera, gallery, storage, network }

class PermissionError extends PlatformError {
  final PermissionType permissionType;
  final PermissionStatus status;
  
  const PermissionError({
    required this.permissionType,
    required this.status,
  }) : super(
        message: 'Permission ${permissionType.name} is ${status.name}',
        feature: _getFeatureFromPermission(permissionType),
        code: 'PERMISSION_ERROR',
      );
  
  @override
  String get userMessage {
    final featureName = _getFeatureName(permissionType);
    switch (status) {
      case PermissionStatus.denied:
        return '需要$featureName權限才能使用此功能';
      case PermissionStatus.permanentlyDenied:
        return '$featureName權限已被永久拒絕，請至設定中手動開啟';
      case PermissionStatus.restricted:
        return '$featureName功能受到限制';
      case PermissionStatus.limited:
        return '$featureName權限受限';
      default:
        return '$featureName權限異常';
    }
  }
  
  static PlatformFeature _getFeatureFromPermission(PermissionType type) {
    switch (type) {
      case PermissionType.camera: return PlatformFeature.camera;
      case PermissionType.photos: return PlatformFeature.gallery;
      case PermissionType.storage: return PlatformFeature.storage;
    }
  }
  
  String _getFeatureName(PermissionType type) {
    switch (type) {
      case PermissionType.camera: return '相機';
      case PermissionType.photos: return '相簿';
      case PermissionType.storage: return '儲存';
    }
  }
}

enum PermissionType { camera, photos, storage }
enum PermissionStatus { granted, denied, permanentlyDenied, restricted, limited }
```

## 3. 錯誤處理機制

### 3.1 錯誤捕獲與報告

**Global Error Handler**：
```
class GlobalErrorHandler {
  static final _logger = Logger('GlobalErrorHandler');
  static final _crashlytics = FirebaseCrashlytics.instance;
  
  static void initialize() {
    // 捕獲 Flutter 框架錯誤
    FlutterError.onError = (FlutterErrorDetails details) {
      _handleFlutterError(details);
    };
    
    // 捕獲 Dart 異步錯誤
    PlatformDispatcher.instance.onError = (error, stack) {
      _handleDartError(error, stack);
      return true;
    };
  }
  
  static void _handleFlutterError(FlutterErrorDetails details) {
    _logger.severe('Flutter Error', details.exception, details.stack);
    
    if (!kDebugMode) {
      _crashlytics.recordFlutterError(details);
    }
    
    // 在開發模式下顯示紅色錯誤畫面
    if (kDebugMode) {
      FlutterError.presentError(details);
    }
  }
  
  static void _handleDartError(Object error, StackTrace stack) {
    _logger.severe('Dart Error', error, stack);
    
    if (!kDebugMode) {
      _crashlytics.recordError(error, stack);
    }
  }
  
  static void reportError(AppError error, {StackTrace? stack}) {
    _logger.warning('App Error: ${error.message}', error, stack);
    
    if (error.severity == ErrorSeverity.critical && !kDebugMode) {
      _crashlytics.recordError(error, stack);
    }
  }
}
```

### 3.2 錯誤恢復策略

**Retry Mechanism**：
```
class RetryHandler {
  static Future<T> withRetry<T>(
    Future<T> Function() operation, {
    int maxRetries = 3,
    Duration initialDelay = const Duration(seconds: 1),
    double backoffMultiplier = 2.0,
    bool Function(dynamic error)? shouldRetry,
  }) async {
    int attempt = 0;
    Duration delay = initialDelay;
    
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        
        if (attempt >= maxRetries || 
            (shouldRetry != null && !shouldRetry(error))) {
          rethrow;
        }
        
        await Future.delayed(delay);
        delay = Duration(
          milliseconds: (delay.inMilliseconds * backoffMultiplier).round(),
        );
      }
    }
    
    throw Exception('Max retries exceeded');
  }
  
  static bool shouldRetryError(dynamic error) {
    if (error is AppError) {
      return error.canRetry;
    }
    
    if (error is SocketException) return true;
    if (error is TimeoutException) return true;
    if (error is HttpException) {
      // 只重試 5xx 錯誤
      return error.message.contains('500') || 
             error.message.contains('502') ||
             error.message.contains('503');
    }
    
    return false;
  }
}
```

**Circuit Breaker Pattern**：
```
class CircuitBreaker {
  final int failureThreshold;
  final Duration resetTimeout;
  final Duration monitoringPeriod;
  
  int _failureCount = 0;
  DateTime? _lastFailureTime;
  CircuitBreakerState _state = CircuitBreakerState.closed;
  
  CircuitBreaker({
    this.failureThreshold = 5,
    this.resetTimeout = const Duration(minutes: 1),
    this.monitoringPeriod = const Duration(seconds: 30),
  });
  
  Future<T> execute<T>(Future<T> Function() operation) async {
    if (_state == CircuitBreakerState.open) {
      if (_shouldAttemptReset()) {
        _state = CircuitBreakerState.halfOpen;
      } else {
        throw CircuitBreakerOpenException();
      }
    }
    
    try {
      final result = await operation();
      _onSuccess();
      return result;
    } catch (error) {
      _onFailure();
      rethrow;
    }
  }
  
  bool _shouldAttemptReset() {
    return _lastFailureTime != null &&
           DateTime.now().difference(_lastFailureTime!) > resetTimeout;
  }
  
  void _onSuccess() {
    _failureCount = 0;
    _state = CircuitBreakerState.closed;
  }
  
  void _onFailure() {
    _failureCount++;
    _lastFailureTime = DateTime.now();
    
    if (_failureCount >= failureThreshold) {
      _state = CircuitBreakerState.open;
    }
  }
}

enum CircuitBreakerState { closed, open, halfOpen }

class CircuitBreakerOpenException implements Exception {
  const CircuitBreakerOpenException();
  
  @override
  String toString() => 'Circuit breaker is open - service temporarily unavailable';
}
```

### 3.3 降級服務機制

**Service Degradation**：
```
class DegradationManager {
  final Map<String, DegradationLevel> _serviceLevels = {};
  final Map<String, DateTime> _degradationStartTime = {};
  
  void degradeService(String serviceName, DegradationLevel level) {
    _serviceLevels[serviceName] = level;
    _degradationStartTime[serviceName] = DateTime.now();
    
    _notifyDegradation(serviceName, level);
  }
  
  void restoreService(String serviceName) {
    _serviceLevels.remove(serviceName);
    _degradationStartTime.remove(serviceName);
    
    _notifyRestoration(serviceName);
  }
  
  DegradationLevel getServiceLevel(String serviceName) {
    return _serviceLevels[serviceName] ?? DegradationLevel.normal;
  }
  
  bool isServiceDegraded(String serviceName) {
    return _serviceLevels.containsKey(serviceName);
  }
  
  void _notifyDegradation(String serviceName, DegradationLevel level) {
    // 通知使用者服務降級
    switch (level) {
      case DegradationLevel.reduced:
        _showMessage('$serviceName 服務效能降低');
        break;
      case DegradationLevel.minimal:
        _showMessage('$serviceName 服務功能受限');
        break;
      case DegradationLevel.offline:
        _showMessage('$serviceName 服務暫時不可用');
        break;
      case DegradationLevel.normal:
        break;
    }
  }
  
  void _notifyRestoration(String serviceName) {
    _showMessage('$serviceName 服務已恢復正常');
  }
  
  void _showMessage(String message) {
    // 實現使用者通知邏輯
  }
}

enum DegradationLevel { normal, reduced, minimal, offline }
```

**Fallback Strategies**：
```
class FallbackStrategy {
  static Future<T> withFallback<T>(
    Future<T> Function() primary,
    Future<T> Function() fallback, {
    bool Function(dynamic error)? shouldFallback,
  }) async {
    try {
      return await primary();
    } catch (error) {
      if (shouldFallback == null || shouldFallback(error)) {
        return await fallback();
      }
      rethrow;
    }
  }
  
  static Future<List<ScanItem>> getScanItemsWithFallback(
    ScanItemRepository repository,
  ) async {
    return withFallback(
      // 主要策略：從 API 獲取
      () => repository.getScanItemsFromApi(),
      // 降級策略：從本地快取獲取
      () => repository.getScanItemsFromCache(),
      shouldFallback: (error) => error is NetworkError,
    );
  }
  
  static Future<ProcessingResult> processImageWithFallback(
    ProcessingService service,
    File image,
  ) async {
    return withFallback(
      // 主要策略：雲端 AI 處理
      () => service.processWithCloudAI(image),
      // 降級策略：本地 OCR 處理
      () => service.processWithLocalOCR(image),
      shouldFallback: (error) => 
        error is NetworkError || error is ProcessingError,
    );
  }
}
```

## 4. 使用者體驗錯誤處理

### 4.1 錯誤訊息設計

**User-Friendly Error Messages**：
```
class ErrorMessageFormatter {
  static String formatErrorMessage(AppError error, BuildContext context) {
    final l10n = Localizations.of(context);
    
    // 基本使用者訊息
    String message = error.userMessage;
    
    // 添加建議解決方案
    final suggestion = _getSuggestion(error, l10n);
    if (suggestion != null) {
      message += '\n\n$suggestion';
    }
    
    return message;
  }
  
  static String? _getSuggestion(AppError error, AppLocalizations l10n) {
    if (error is NetworkError) {
      return l10n.networkErrorSuggestion; // "請檢查網路連線並重試"
    }
    
    if (error is PermissionError) {
      return l10n.permissionErrorSuggestion; // "請至設定中開啟相關權限"
    }
    
    if (error is InsufficientStorageError) {
      return l10n.storageErrorSuggestion; // "請清理部分檔案以釋放空間"
    }
    
    if (error is ImageProcessingError) {
      switch (error.imageErrorType) {
        case ImageErrorType.poorQuality:
          return l10n.imageQualityErrorSuggestion; // "請確保圖片清晰且光線充足"
        case ImageErrorType.tooLarge:
          return l10n.imageSizeErrorSuggestion; // "請選擇較小的圖片檔案"
        default:
          return null;
      }
    }
    
    return null;
  }
}
```

### 4.2 錯誤 UI 組件

**Error Display Components**：
```
class ErrorDisplayWidget extends StatelessWidget {
  final AppError error;
  final VoidCallback? onRetry;
  final VoidCallback? onDismiss;
  final bool showDetails;
  
  const ErrorDisplayWidget({
    Key? key,
    required this.error,
    this.onRetry,
    this.onDismiss,
    this.showDetails = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      color: _getErrorColor(error.severity),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Icon(
                  _getErrorIcon(error.severity),
                  color: Colors.white,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    ErrorMessageFormatter.formatErrorMessage(error, context),
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
            if (showDetails && error.code != null) ...[
              const SizedBox(height: 8),
              Text(
                'Error Code: ${error.code}',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                ),
              ),
            ],
            if (onRetry != null || onDismiss != null) ...[
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (onDismiss != null)
                    TextButton(
                      onPressed: onDismiss,
                      child: const Text('關閉', style: TextStyle(color: Colors.white)),
                    ),
                  if (onRetry != null && error.canRetry) ...[
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: onRetry,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _getErrorColor(error.severity),
                      ),
                      child: const Text('重試'),
                    ),
                  ],
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Color _getErrorColor(ErrorSeverity severity) {
    switch (severity) {
      case ErrorSeverity.info:
        return Colors.blue;
      case ErrorSeverity.warning:
        return Colors.orange;
      case ErrorSeverity.error:
        return Colors.red;
      case ErrorSeverity.critical:
        return Colors.red.shade900;
    }
  }
  
  IconData _getErrorIcon(ErrorSeverity severity) {
    switch (severity) {
      case ErrorSeverity.info:
        return Icons.info_outline;
      case ErrorSeverity.warning:
        return Icons.warning_outlined;
      case ErrorSeverity.error:
        return Icons.error_outline;
      case ErrorSeverity.critical:
        return Icons.dangerous_outlined;
    }
  }
}
```

**Snackbar Error Display**：
```
class ErrorSnackbarService {
  static void showError(
    BuildContext context,
    AppError error, {
    VoidCallback? onRetry,
  }) {
    final messenger = ScaffoldMessenger.of(context);
    
    messenger.clearSnackBars();
    messenger.showSnackBar(
      SnackBar(
        content: Text(error.userMessage),
        backgroundColor: _getErrorColor(error.severity),
        duration: _getErrorDuration(error.severity),
        action: error.canRetry && onRetry != null
          ? SnackBarAction(
              label: '重試',
              textColor: Colors.white,
              onPressed: onRetry,
            )
          : null,
      ),
    );
  }
  
  static Color _getErrorColor(ErrorSeverity severity) {
    switch (severity) {
      case ErrorSeverity.info:
        return Colors.blue;
      case ErrorSeverity.warning:
        return Colors.orange;
      case ErrorSeverity.error:
        return Colors.red;
      case ErrorSeverity.critical:
        return Colors.red.shade900;
    }
  }
  
  static Duration _getErrorDuration(ErrorSeverity severity) {
    switch (severity) {
      case ErrorSeverity.info:
        return const Duration(seconds: 3);
      case ErrorSeverity.warning:
        return const Duration(seconds: 4);
      case ErrorSeverity.error:
        return const Duration(seconds: 6);
      case ErrorSeverity.critical:
        return const Duration(seconds: 8);
    }
  }
}
```

### 4.3 錯誤狀態頁面

**Error State Pages**：
```
class ErrorStatePage extends StatelessWidget {
  final AppError error;
  final VoidCallback? onRetry;
  final VoidCallback? onGoBack;
  final String? customTitle;
  final String? customMessage;
  
  const ErrorStatePage({
    Key? key,
    required this.error,
    this.onRetry,
    this.onGoBack,
    this.customTitle,
    this.customMessage,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(customTitle ?? '發生錯誤'),
        leading: onGoBack != null
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: onGoBack,
            )
          : null,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                _getErrorIcon(error),
                size: 80,
                color: Colors.grey.shade400,
              ),
              const SizedBox(height: 24),
              Text(
                customMessage ?? error.userMessage,
                style: Theme.of(context).textTheme.headlineSmall,
                textAlign: TextAlign.center,
              ),
              if (error.code != null) ...[
                const SizedBox(height: 16),
                Text(
                  '錯誤代碼: ${error.code}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
              const SizedBox(height: 32),
              if (error.canRetry && onRetry != null)
                ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh),
                  label: const Text('重試'),
                ),
              if (onGoBack != null) ...[
                const SizedBox(height: 16),
                TextButton(
                  onPressed: onGoBack,
                  child: const Text('返回'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
  
  IconData _getErrorIcon(AppError error) {
    if (error is NetworkError) return Icons.wifi_off;
    if (error is ProcessingError) return Icons.warning;
    if (error is StorageError) return Icons.storage;
    if (error is PermissionError) return Icons.lock;
    return Icons.error_outline;
  }
}
```

## 5. 特定場景錯誤處理

### 5.1 相機掃描錯誤處理

**Camera Error Handling**：
```
class CameraErrorHandler {
  static Future<void> handleCameraError(
    BuildContext context,
    AppError error,
    CameraController? controller,
  ) async {
    if (error is PermissionError) {
      await _handlePermissionError(context, error);
    } else if (error is PlatformError) {
      await _handlePlatformError(context, error, controller);
    } else {
      ErrorSnackbarService.showError(context, error);
    }
  }
  
  static Future<void> _handlePermissionError(
    BuildContext context,
    PermissionError error,
  ) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('需要相機權限'),
        content: Text(error.userMessage),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('前往設定'),
          ),
        ],
      ),
    );
    
    if (result == true) {
      await openAppSettings();
    }
  }
  
  static Future<void> _handlePlatformError(
    BuildContext context,
    PlatformError error,
    CameraController? controller,
  ) async {
    // 嘗試重新初始化相機
    if (controller != null) {
      try {
        await controller.dispose();
        await Future.delayed(const Duration(milliseconds: 500));
        await controller.initialize();
        return;
      } catch (e) {
        // 重新初始化失敗，顯示錯誤
      }
    }
    
    ErrorSnackbarService.showError(
      context,
      error,
      onRetry: () async {
        // 重新嘗試初始化相機
        if (controller != null) {
          try {
            await controller.initialize();
          } catch (e) {
            // 處理重試失敗
          }
        }
      },
    );
  }
}
```

### 5.2 處理流程錯誤處理

**Processing Error Handling**：
```
class ProcessingErrorHandler {
  static Future<void> handleProcessingError(
    BuildContext context,
    ProcessingError error,
    ProcessingService service,
  ) async {
    switch (error.stage) {
      case ProcessingStage.upload:
        await _handleUploadError(context, error, service);
        break;
      case ProcessingStage.processing:
        await _handleAIProcessingError(context, error, service);
        break;
      case ProcessingStage.extraction:
        await _handleExtractionError(context, error, service);
        break;
      case ProcessingStage.validation:
        await _handleValidationError(context, error);
        break;
    }
  }
  
  static Future<void> _handleUploadError(
    BuildContext context,
    ProcessingError error,
    ProcessingService service,
  ) async {
    // 提供重試選項
    ErrorSnackbarService.showError(
      context,
      error,
      onRetry: () async {
        if (error.jobId != null) {
          await service.retryUpload(error.jobId!);
        }
      },
    );
  }
  
  static Future<void> _handleAIProcessingError(
    BuildContext context,
    ProcessingError error,
    ProcessingService service,
  ) async {
    if (error is ImageProcessingError) {
      switch (error.imageErrorType) {
        case ImageErrorType.poorQuality:
          await _showImageQualityDialog(context);
          break;
        case ImageErrorType.noTextDetected:
          await _showNoTextDialog(context);
          break;
        default:
          ErrorSnackbarService.showError(context, error);
      }
    } else {
      ErrorSnackbarService.showError(context, error);
    }
  }
  
  static Future<void> _showImageQualityDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('圖片品質不佳'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('為了獲得最佳辨識效果，請確保：'),
            SizedBox(height: 8),
            Text('• 圖片清晰不模糊'),
            Text('• 光線充足'),
            Text('• 文字完整可見'),
            Text('• 避免反光或陰影'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('重新拍攝'),
          ),
        ],
      ),
    );
  }
  
  static Future<void> _showNoTextDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('未偵測到文字'),
        content: const Text('圖片中沒有偵測到可識別的文字內容。請確保圖片包含清晰的文字。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('了解'),
          ),
        ],
      ),
    );
  }
}
```

## 6. 監控與分析

### 6.1 錯誤監控

**Error Monitoring Service**：
```
class ErrorMonitoringService {
  static final _analytics = FirebaseAnalytics.instance;
  static final _crashlytics = FirebaseCrashlytics.instance;
  
  static void trackError(AppError error, {StackTrace? stackTrace}) {
    // 記錄到 Analytics
    _analytics.logEvent(
      name: 'app_error',
      parameters: {
        'error_type': error.runtimeType.toString(),
        'error_code': error.code ?? 'unknown',
        'error_severity': error.severity.name,
        'can_retry': error.canRetry,
        'timestamp': error.timestamp.millisecondsSinceEpoch,
      },
    );
    
    // 記錄到 Crashlytics (僅限嚴重錯誤)
    if (error.severity == ErrorSeverity.critical) {
      _crashlytics.recordError(
        error,
        stackTrace,
        fatal: false,
        information: [
          DiagnosticsProperty('errorCode', error.code),
          DiagnosticsProperty('canRetry', error.canRetry),
          DiagnosticsProperty('metadata', error.metadata),
        ],
      );
    }
    
    // 本地錯誤日誌
    _logErrorLocally(error, stackTrace);
  }
  
  static void _logErrorLocally(AppError error, StackTrace? stackTrace) {
    final logger = Logger('ErrorMonitoring');
    logger.severe(
      '${error.runtimeType}: ${error.message}',
      error,
      stackTrace,
    );
  }
  
  static Future<void> setUserIdentifier(String userId) async {
    await _crashlytics.setUserIdentifier(userId);
    await _analytics.setUserId(id: userId);
  }
  
  static void setCustomKeys(Map<String, String> keys) {
    for (final entry in keys.entries) {
      _crashlytics.setCustomKey(entry.key, entry.value);
    }
  }
}
```

### 6.2 錯誤分析

**Error Analytics**：
```
class ErrorAnalytics {
  static void trackErrorResolution(
    AppError error,
    ErrorResolutionMethod method,
    bool successful,
  ) {
    FirebaseAnalytics.instance.logEvent(
      name: 'error_resolution',
      parameters: {
        'error_type': error.runtimeType.toString(),
        'error_code': error.code ?? 'unknown',
        'resolution_method': method.name,
        'successful': successful,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
      },
    );
  }
  
  static void trackUserErrorAction(
    AppError error,
    UserErrorAction action,
  ) {
    FirebaseAnalytics.instance.logEvent(
      name: 'user_error_action',
      parameters: {
        'error_type': error.runtimeType.toString(),
        'user_action': action.name,
        'timestamp': DateTime.now().millisecondsSinceEpoch,
      },
    );
  }
}

enum ErrorResolutionMethod { 
  autoRetry, userRetry, fallback, manual, ignored 
}

enum UserErrorAction { 
  retry, dismiss, reportBug, contactSupport, goBack 
}
```

## 7. 開發與測試

### 7.1 錯誤模擬

**Error Simulation for Testing**：
```
class ErrorSimulator {
  static bool _simulationEnabled = false;
  static final Map<String, AppError> _simulatedErrors = {};
  
  static void enableSimulation() {
    _simulationEnabled = true;
  }
  
  static void disableSimulation() {
    _simulationEnabled = false;
    _simulatedErrors.clear();
  }
  
  static void simulateError(String operation, AppError error) {
    if (_simulationEnabled) {
      _simulatedErrors[operation] = error;
    }
  }
  
  static AppError? getSimulatedError(String operation) {
    return _simulationEnabled ? _simulatedErrors[operation] : null;
  }
  
  static Future<T> maybeThrowSimulatedError<T>(
    String operation,
    Future<T> Function() actualOperation,
  ) async {
    final simulatedError = getSimulatedError(operation);
    if (simulatedError != null) {
      throw simulatedError;
    }
    
    return await actualOperation();
  }
}
```

### 7.2 錯誤測試工具

**Error Testing Utilities**：
```
class ErrorTestUtils {
  static Future<void> testErrorHandling(
    String testName,
    AppError error,
    Future<void> Function() operation,
  ) async {
    print('Testing error handling for: $testName');
    
    try {
      await operation();
      throw AssertionError('Expected error was not thrown');
    } catch (thrownError) {
      if (thrownError.runtimeType != error.runtimeType) {
        throw AssertionError(
          'Expected ${error.runtimeType} but got ${thrownError.runtimeType}',
        );
      }
      
      print('✓ Error handling test passed for: $testName');
    }
  }
  
  static Future<void> testErrorRecovery(
    String testName,
    AppError error,
    Future<void> Function() failingOperation,
    Future<void> Function() recoveryOperation,
  ) async {
    print('Testing error recovery for: $testName');
    
    // 第一次操作應該失敗
    bool firstOperationFailed = false;
    try {
      await failingOperation();
    } catch (e) {
      firstOperationFailed = true;
      assert(e.runtimeType == error.runtimeType);
    }
    
    assert(firstOperationFailed, 'First operation should have failed');
    
    // 恢復操作應該成功
    await recoveryOperation();
    
    print('✓ Error recovery test passed for: $testName');
  }
}