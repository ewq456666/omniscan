**啟動時間測量與最佳化**：
```
class StartupPerformanceMonitor {
  static final Stopwatch _startupTimer = Stopwatch();
  static final Map<String, int> _milestones = {};
  
  static void startMeasurement() {
    _startupTimer.start();
  }
  
  static void recordMilestone(String name) {
    _milestones[name] = _startupTimer.elapsedMilliseconds;
  }
  
  static void endMeasurement() {
    _startupTimer.stop();
    _reportStartupMetrics();
  }
  
  static void _reportStartupMetrics() {
    final totalTime = _startupTimer.elapsedMilliseconds;
    
    // 記錄到 Analytics
    FirebaseAnalytics.instance.logEvent(
      name: 'app_startup_performance',
      parameters: {
        'total_startup_time': totalTime,
        'core_init_time': _milestones['core_init'] ?? 0,
        'ui_ready_time': _milestones['ui_ready'] ?? 0,
        'data_loaded_time': _milestones['data_loaded'] ?? 0,
      },
    );
    
    // 開發模式下輸出詳細資訊
    if (kDebugMode) {
      print('=== Startup Performance ===');
      print('Total startup time: ${totalTime}ms');
      _milestones.forEach((name, time) {
        print('$name: ${time}ms');
      });
    }
  }
}
```

**啟動最佳化實現**：
```
class OptimizedAppInitializer {
  static Future<void> initialize() async {
    StartupPerformanceMonitor.startMeasurement();
    
    // 階段 1: 核心服務初始化
    await _initializeCoreServices();
    StartupPerformanceMonitor.recordMilestone('core_init');
    
    // 階段 2: UI 框架準備
    await _prepareUIFramework();
    StartupPerformanceMonitor.recordMilestone('ui_ready');
    
    // 階段 3: 背景初始化 (不阻塞 UI)
    _initializeBackgroundServices();
    
    StartupPerformanceMonitor.endMeasurement();
  }
  
  static Future<void> _initializeCoreServices() async {
    await Future.wait([
      _initializeDatabase(),
      _initializePreferences(),
      _initializeErrorHandling(),
    ]);
  }
  
  static Future<void> _prepareUIFramework() async {
    // 預載入關鍵 UI 資源
    await Future.wait([
      _preloadCriticalImages(),
      _initializeTheme(),
      _setupNavigation(),
    ]);
  }
  
  static void _initializeBackgroundServices() {
    // 異步初始化，不阻塞主執行緒
    Future.microtask(() async {
      await Future.wait([
        _initializeNetworkServices(),
        _initializeNotifications(),
        _initializeCacheServices(),
      ]);
    });
  }
}
```

### 2.2 記憶體最佳化

**記憶體管理策略**：
```
class MemoryManager {
  static const int _maxImageCacheSize = 50 * 1024 * 1024; // 50MB
  static const int _maxListItemsInMemory = 100;
  
  static final Map<String, WeakReference<dynamic>> _cache = {};
  static Timer? _cleanupTimer;
  
  static void initialize() {
    _startPeriodicCleanup();
    _monitorMemoryUsage();
  }
  
  static void _startPeriodicCleanup() {
    _cleanupTimer = Timer.periodic(
      const Duration(minutes: 5),
      (_) => _performCleanup(),
    );
  }
  
  static void _performCleanup() {
    // 清理無效的弱引用
    _cache.removeWhere((key, ref) => ref.target == null);
    
    // 觸發垃圾回收
    if (_cache.length > 1000) {
      _cache.clear();
    }
    
    // 清理圖片快取
    PaintingBinding.instance.imageCache.clear();
    
    if (kDebugMode) {
      print('Memory cleanup completed. Cache size: ${_cache.length}');
    }
  }
  
  static void _monitorMemoryUsage() {
    if (kDebugMode) {
      Timer.periodic(const Duration(seconds: 30), (_) {
        final rss = ProcessInfo.currentRss;
        final maxRss = ProcessInfo.maxRss;
        print('Memory usage: ${_formatBytes(rss)} / ${_formatBytes(maxRss)}');
        
        if (rss > 200 * 1024 * 1024) { // 200MB
          print('Warning: High memory usage detected');
          _performCleanup();
        }
      });
    }
  }
  
  static String _formatBytes(int bytes) {
    if (bytes < 1024) return '${bytes}B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)}KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)}MB';
  }
}
```

## 3. UI 渲染效能最佳化

### 3.1 Widget 最佳化

**Widget 重建最小化**：
```
class OptimizedWidgetPatterns {
  // 使用 const 構造函數
  static const Widget staticHeader = Padding(
    padding: EdgeInsets.all(16.0),
    child: Text('OmniScan', style: TextStyle(fontSize: 24)),
  );
  
  // 使用 ValueListenableBuilder 精確重建
  static Widget buildCounterDisplay(ValueNotifier<int> counter) {
    return ValueListenableBuilder<int>(
      valueListenable: counter,
      builder: (context, count, child) {
        return Text('Count: $count');
      },
    );
  }
  
  // 使用 RepaintBoundary 隔離重繪
  static Widget buildComplexChart(ChartData data) {
    return RepaintBoundary(
      child: CustomPaint(
        painter: ChartPainter(data),
        size: const Size(300, 200),
      ),
    );
  }
}
```

**列表效能最佳化**：
```
class OptimizedListView extends StatelessWidget {
  final List<ScanItem> items;
  final VoidCallback? onLoadMore;
  
  const OptimizedListView({
    Key? key,
    required this.items,
    this.onLoadMore,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      // 使用 itemExtent 提高滾動效能
      itemExtent: 120.0,
      // 快取範圍最佳化
      cacheExtent: 1000.0,
      // 項目數量
      itemCount: items.length + (onLoadMore != null ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == items.length) {
          // 載入更多指示器
          return const LoadMoreIndicator();
        }
        
        return RepaintBoundary(
          child: ScanItemCard(
            key: ValueKey(items[index].id),
            item: items[index],
          ),
        );
      },
    );
  }
}

class ScanItemCard extends StatelessWidget {
  final ScanItem item;
  
  const ScanItemCard({
    Key? key,
    required this.item,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        // 使用快取的縮圖
        leading: OptimizedImageWidget(
          imageUrl: item.thumbnailPath,
          width: 56,
          height: 56,
        ),
        title: Text(
          item.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          item.extractedText,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: IconButton(
          icon: const Icon(Icons.more_vert),
          onPressed: () => _showItemMenu(context),
        ),
      ),
    );
  }
  
  void _showItemMenu(BuildContext context) {
    // 菜單邏輯
  }
}
```

### 3.2 圖片最佳化

**圖片載入與快取最佳化**：
```
class OptimizedImageWidget extends StatelessWidget {
  final String? imageUrl;
  final String? imagePath;
  final double? width;
  final double? height;
  final BoxFit fit;
  final Widget? placeholder;
  final Widget? errorWidget;
  
  const OptimizedImageWidget({
    Key? key,
    this.imageUrl,
    this.imagePath,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.placeholder,
    this.errorWidget,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    if (imagePath != null) {
      return _buildFileImage();
    } else if (imageUrl != null) {
      return _buildNetworkImage();
    } else {
      return _buildPlaceholder();
    }
  }
  
  Widget _buildFileImage() {
    return Image.file(
      File(imagePath!),
      width: width,
      height: height,
      fit: fit,
      // 使用適當的快取政策
      cacheWidth: width?.round(),
      cacheHeight: height?.round(),
      errorBuilder: (context, error, stackTrace) {
        return errorWidget ?? _buildPlaceholder();
      },
    );
  }
  
  Widget _buildNetworkImage() {
    return CachedNetworkImage(
      imageUrl: imageUrl!,
      width: width,
      height: height,
      fit: fit,
      // 記憶體快取設定
      memCacheWidth: width?.round(),
      memCacheHeight: height?.round(),
      // 漸進式載入
      progressIndicatorBuilder: (context, url, progress) {
        return placeholder ?? 
          Center(
            child: CircularProgressIndicator(
              value: progress.progress,
            ),
          );
      },
      errorWidget: (context, url, error) {
        return errorWidget ?? _buildPlaceholder();
      },
    );
  }
  
  Widget _buildPlaceholder() {
    return Container(
      width: width,
      height: height,
      color: Colors.grey.shade200,
      child: const Icon(
        Icons.image,
        color: Colors.grey,
      ),
    );
  }
}
```

**圖片處理最佳化**：
```
class ImageOptimizationService {
  static const int _maxImageSize = 2048;
  static const double _compressionQuality = 0.8;
  
  static Future<File> optimizeImage(File originalFile) async {
    final image = img.decodeImage(await originalFile.readAsBytes());
    if (image == null) throw Exception('Invalid image format');
    
    // 計算最佳尺寸
    final optimizedSize = _calculateOptimalSize(
      image.width, 
      image.height,
    );
    
    // 調整大小
    final resizedImage = img.copyResize(
      image,
      width: optimizedSize.width,
      height: optimizedSize.height,
      interpolation: img.Interpolation.linear,
    );
    
    // 壓縮並儲存
    final optimizedBytes = img.encodeJpg(
      resizedImage,
      quality: (_compressionQuality * 100).round(),
    );
    
    final optimizedFile = File(
      '${originalFile.path.replaceAll('.', '_optimized.')}',
    );
    
    await optimizedFile.writeAsBytes(optimizedBytes);
    return optimizedFile;
  }
  
  static Size _calculateOptimalSize(int originalWidth, int originalHeight) {
    if (originalWidth <= _maxImageSize && originalHeight <= _maxImageSize) {
      return Size(originalWidth.toDouble(), originalHeight.toDouble());
    }
    
    final aspectRatio = originalWidth / originalHeight;
    
    if (originalWidth > originalHeight) {
      return Size(
        _maxImageSize.toDouble(),
        (_maxImageSize / aspectRatio),
      );
    } else {
      return Size(
        (_maxImageSize * aspectRatio),
        _maxImageSize.toDouble(),
      );
    }
  }
  
  static Future<File> generateThumbnail(
    File originalFile, {
    int size = 200,
  }) async {
    final image = img.decodeImage(await originalFile.readAsBytes());
    if (image == null) throw Exception('Invalid image format');
    
    final thumbnail = img.copyResizeCropSquare(image, size: size);
    final thumbnailBytes = img.encodeJpg(thumbnail, quality: 80);
    
    final thumbnailFile = File(
      '${originalFile.path.replaceAll('.', '_thumb.')}',
    );
    
    await thumbnailFile.writeAsBytes(thumbnailBytes);
    return thumbnailFile;
  }
}
```

### 3.3 動畫效能最佳化

**高效能動畫實現**：
```
class OptimizedAnimations {
  static AnimationController createOptimizedController({
    required TickerProvider vsync,
    required Duration duration,
  }) {
    return AnimationController(
      duration: duration,
      vsync: vsync,
    );
  }
  
  static Animation<double> createOptimizedTween({
    required AnimationController controller,
    required double begin,
    required double end,
    Curve curve = Curves.easeInOut,
  }) {
    return Tween<double>(
      begin: begin,
      end: end,
    ).animate(
      CurvedAnimation(
        parent: controller,
        curve: curve,
      ),
    );
  }
}

class ScanButtonAnimation extends StatefulWidget {
  final VoidCallback onPressed;
  
  const ScanButtonAnimation({Key? key, required this.onPressed}) : super(key: key);
  
  @override
  State<ScanButtonAnimation> createState() => _ScanButtonAnimationState();
}

class _ScanButtonAnimationState extends State<ScanButtonAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;
  
  @override
  void initState() {
    super.initState();
    
    _controller = OptimizedAnimations.createOptimizedController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    
    _scaleAnimation = OptimizedAnimations.createOptimizedTween(
      controller: _controller,
      begin: 1.0,
      end: 0.95,
      curve: Curves.easeInOut,
    );
    
    _rotationAnimation = Tween<double>(
      begin: 0.0,
      end: 0.1,
    ).animate(_controller);
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Transform.rotate(
            angle: _rotationAnimation.value,
            child: FloatingActionButton(
              onPressed: _handlePress,
              child: const Icon(Icons.camera_alt),
            ),
          ),
        );
      },
    );
  }
  
  void _handlePress() {
    _controller.forward().then((_) {
      _controller.reverse();
      widget.onPressed();
    });
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

## 4. 資料處理效能最佳化

### 4.1 資料庫效能最佳化

**查詢最佳化策略**：
```
class DatabaseOptimization {
  static Future<void> optimizeDatabase(Database db) async {
    // 創建索引
    await _createOptimizedIndexes(db);
    
    // 分析查詢計劃
    await _analyzeQueryPlans(db);
    
    // 設定最佳化參數
    await _configureOptimizations(db);
  }
  
  static Future<void> _createOptimizedIndexes(Database db) async {
    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_scan_items_created_at 
      ON scan_items(created_at DESC)
    ''');
    
    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_scan_items_type_created 
      ON scan_items(scan_type, created_at DESC)
    ''');
    
    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_extracted_data_scan_id 
      ON extracted_data(scan_item_id)
    ''');
    
    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_tags_usage_count 
      ON tags(usage_count DESC)
    ''');
  }
  
  static Future<void> _configureOptimizations(Database db) async {
    // WAL 模式提升並發效能
    await db.execute('PRAGMA journal_mode=WAL');
    
    // 增加快取大小
    await db.execute('PRAGMA cache_size=10000');
    
    // 啟用記憶體映射
    await db.execute('PRAGMA mmap_size=268435456'); // 256MB
    
    // 同步設定最佳化
    await db.execute('PRAGMA synchronous=NORMAL');
  }
}
```

**分頁查詢最佳化**：
```
class OptimizedPagination {
  static Future<List<ScanItem>> getScanItemsPaginated({
    required Database db,
    required int limit,
    required int offset,
    String? searchQuery,
    ScanType? filterType,
  }) async {
    final stopwatch = Stopwatch()..start();
    
    String sql = '''
      SELECT * FROM scan_items 
      WHERE 1=1
    ''';
    
    final args = <dynamic>[];
    
    if (searchQuery != null && searchQuery.isNotEmpty) {
      sql += ' AND (title LIKE ? OR extracted_text LIKE ?)';
      args.addAll(['%$searchQuery%', '%$searchQuery%']);
    }
    
    if (filterType != null) {
      sql += ' AND scan_type = ?';
      args.add(filterType.name);
    }
    
    sql += '''
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    ''';
    args.addAll([limit, offset]);
    
    final results = await db.rawQuery(sql, args);
    
    stopwatch.stop();
    if (kDebugMode) {
      print('Query executed in ${stopwatch.elapsedMilliseconds}ms');
    }
    
    return results.map((row) => ScanItem.fromMap(row)).toList();
  }
  
  // 使用 cursor-based 分頁提升大數據集效能
  static Future<List<ScanItem>> getScanItemsCursorPaginated({
    required Database db,
    required int limit,
    DateTime? cursor,
  }) async {
    String sql = '''
      SELECT * FROM scan_items 
    ''';
    
    final args = <dynamic>[];
    
    if (cursor != null) {
      sql += 'WHERE created_at < ? ';
      args.add(cursor.millisecondsSinceEpoch);
    }
    
    sql += '''
      ORDER BY created_at DESC 
      LIMIT ?
    ''';
    args.add(limit);
    
    final results = await db.rawQuery(sql, args);
    return results.map((row) => ScanItem.fromMap(row)).toList();
  }
}
```

### 4.2 網路請求最佳化

**請求最佳化策略**：
```
class NetworkOptimization {
  static final _httpClient = http.Client();
  static final _requestCache = <String, CachedResponse>{};
  
  static Future<http.Response> optimizedRequest({
    required String url,
    Map<String, String>? headers,
    Duration? timeout,
    bool useCache = true,
  }) async {
    final cacheKey = _generateCacheKey(url, headers);
    
    // 檢查快取
    if (useCache && _requestCache.containsKey(cacheKey)) {
      final cached = _requestCache[cacheKey]!;
      if (!cached.isExpired) {
        return cached.response;
      }
    }
    
    final stopwatch = Stopwatch()..start();
    
    try {
      final response = await _httpClient
          .get(
            Uri.parse(url),
            headers: headers,
          )
          .timeout(timeout ?? const Duration(seconds: 30));
      
      stopwatch.stop();
      
      // 記錄效能指標
      _recordNetworkMetrics(url, stopwatch.elapsedMilliseconds, response.statusCode);
      
      // 更新快取
      if (useCache && response.statusCode == 200) {
        _requestCache[cacheKey] = CachedResponse(
          response: response,
          timestamp: DateTime.now(),
          ttl: const Duration(minutes: 5),
        );
      }
      
      return response;
    } catch (error) {
      stopwatch.stop();
      _recordNetworkError(url, error, stopwatch.elapsedMilliseconds);
      rethrow;
    }
  }
  
  static void _recordNetworkMetrics(String url, int duration, int statusCode) {
    FirebaseAnalytics.instance.logEvent(
      name: 'network_request_performance',
      parameters: {
        'url': url,
        'duration_ms': duration,
        'status_code': statusCode,
      },
    );
    
    if (kDebugMode) {
      print('Network request to $url: ${duration}ms (Status: $statusCode)');
    }
  }
  
  static void _recordNetworkError(String url, dynamic error, int duration) {
    FirebaseAnalytics.instance.logEvent(
      name: 'network_request_error',
      parameters: {
        'url': url,
        'error_type': error.runtimeType.toString(),
        'duration_ms': duration,
      },
    );
  }
  
  static String _generateCacheKey(String url, Map<String, String>? headers) {
    final buffer = StringBuffer(url);
    if (headers != null) {
      buffer.write(headers.toString());
    }
    return buffer.toString().hashCode.toString();
  }
}

class CachedResponse {
  final http.Response response;
  final DateTime timestamp;
  final Duration ttl;
  
  CachedResponse({
    required this.response,
    required this.timestamp,
    required this.ttl,
  });
  
  bool get isExpired => DateTime.now().difference(timestamp) > ttl;
}
```

### 4.3 背景任務最佳化

**背景處理最佳化**：
```
class BackgroundTaskManager {
  static final _taskQueue = Queue<BackgroundTask>();
  static bool _isProcessing = false;
  static Timer? _processingTimer;
  
  static void scheduleTask(BackgroundTask task) {
    _taskQueue.add(task);
    _processNextTask();
  }
  
  static void _processNextTask() {
    if (_isProcessing || _taskQueue.isEmpty) return;
    
    _isProcessing = true;
    final task = _taskQueue.removeFirst();
    
    _executeSafelyInBackground(task).then((_) {
      _isProcessing = false;
      
      // 控制處理頻率，避免阻塞 UI
      _processingTimer = Timer(const Duration(milliseconds: 50), () {
        _processNextTask();
      });
    });
  }
  
  static Future<void> _executeSafelyInBackground(BackgroundTask task) async {
    try {
      await compute(_executeTask, task);
    } catch (error) {
      print('Background task failed: $error');
      // 錯誤處理邏輯
    }
  }
  
  static Future<void> _executeTask(BackgroundTask task) async {
    switch (task.type) {
      case TaskType.imageProcessing:
        await _processImage(task.data);
        break;
      case TaskType.dataSync:
        await _syncData(task.data);
        break;
      case TaskType.cacheCleanup:
        await _cleanupCache(task.data);
        break;
    }
  }
  
  static Future<void> _processImage(Map<String, dynamic> data) async {
    // 圖片處理邏輯
  }
  
  static Future<void> _syncData(Map<String, dynamic> data) async {
    // 資料同步邏輯
  }
  
  static Future<void> _cleanupCache(Map<String, dynamic> data) async {
    // 快取清理邏輯
  }
}

class BackgroundTask {
  final TaskType type;
  final Map<String, dynamic> data;
  final int priority;
  
  BackgroundTask({
    required this.type,
    required this.data,
    this.priority = 0,
  });
}

enum TaskType { imageProcessing, dataSync, cacheCleanup }
```

## 5. 快取策略最佳化

### 5.1 多層快取架構

**快取層級管理**：
```
class CacheManager {
  static final _memoryCache = LRUCache<String, dynamic>(maxSize: 100);
  static final _diskCache = DiskLruCache(maxSize: 500 * 1024 * 1024); // 500MB
  static final _networkCache = NetworkCache();
  
  static Future<T?> get<T>(
    String key, {
    CacheStrategy strategy = CacheStrategy.memoryFirst,
  }) async {
    switch (strategy) {
      case CacheStrategy.memoryFirst:
        return await _getWithMemoryFirst<T>(key);
      case CacheStrategy.diskFirst:
        return await _getWithDiskFirst<T>(key);
      case CacheStrategy.networkFirst:
        return await _getWithNetworkFirst<T>(key);
    }
  }
  
  static Future<T?> _getWithMemoryFirst<T>(String key) async {
    // 1. 檢查記憶體快取
    final memoryResult = _memoryCache.get(key);
    if (memoryResult != null) {
      return memoryResult as T;
    }
    
    // 2. 檢查磁碟快取
    final diskResult = await _diskCache.get(key);
    if (diskResult != null) {
      // 回填記憶體快取
      _memoryCache.put(key, diskResult);
      return diskResult as T;
    }
    
    // 3. 從網路獲取
    final networkResult = await _networkCache.get<T>(key);
    if (networkResult != null) {
      // 回填快取
      _memoryCache.put(key, networkResult);
      await _diskCache.put(key, networkResult);
      return networkResult;
    }
    
    return null;
  }
  
  static Future<void> put<T>(
    String key,
    T value, {
    Duration? ttl,
  }) async {
    // 存入所有快取層級
    _memoryCache.put(key, value);
    await _diskCache.put(key, value, ttl: ttl);
  }
  
  static Future<void> evict(String key) async {
    _memoryCache.remove(key);
    await _diskCache.remove(key);
  }
  
  static Future<void> clear() async {
    _memoryCache.clear();
    await _diskCache.clear();
  }
}

enum CacheStrategy { memoryFirst, diskFirst, networkFirst }
```

### 5.2 智慧預載入

**預載入策略**：
```
class PreloadManager {
  static final _preloadQueue = PriorityQueue<PreloadTask>();
  static bool _isPreloading = false;
  
  static void schedulePreload(PreloadTask task) {
    _preloadQueue.add(task);
    _processPreloadQueue();
  }
  
  static void _processPreloadQueue() {
    if (_isPreloading || _preloadQueue.isEmpty) return;
    
    _isPreloading = true;
    final task = _preloadQueue.removeFirst();
    
    _executePreloadTask(task).then((_) {
      _isPreloading = false;
      
      // 限制預載入頻率
      Timer(const Duration(milliseconds: 100), () {
        _processPreloadQueue();
      });
    });
  }
  
  static Future<void> _executePreloadTask(PreloadTask task) async {
    try {
      switch (task.type) {
        case PreloadType.image:
          await _preloadImage(task.data);
          break;
        case PreloadType.data:
          await _preloadData(task.data);
          break;
        case PreloadType.ui:
          await _preloadUI(task.data);
          break;
      }
    } catch (error) {
      // 預載入失敗不影響主要功能
      if (kDebugMode) {
        print('Preload failed: $error');
      }
    }
  }
  
  static Future<void> _preloadImage(Map<String, dynamic> data) async {
    final imageUrl = data['url'] as String;
    await precacheImage(NetworkImage(imageUrl), data['context']);
  }
  
  static Future<void> _preloadData(Map<String, dynamic> data) async {
    final repository = data['repository'] as Repository;
    await repository.preloadData();
  }
  
  static Future<void> _preloadUI(Map<String, dynamic> data) async {
    final routeName = data['route'] as String;
    // 預載入路由相關資源
  }
}

class PreloadTask implements Comparable<PreloadTask> {
  final PreloadType type;
  final# OmniScan 效能最佳化策略

## 1. 效能設計總覽

### 1.1 效能目標與指標

OmniScan 以**使用者體驗優先**為核心，設定明確的效能目標來確保應用程式在各種設備條件下都能提供流暢的使用體驗。

**核心效能目標**：
- **冷啟動時間**: < 3 秒
- **熱啟動時間**: < 1 秒
- **頁面轉場**: < 300ms
- **圖片載入**: < 2 秒
- **API 回應處理**: < 500ms
- **滾動流暢度**: 60 FPS
- **記憶體使用**: < 200MB (一般使用)

### 1.2 效能最佳化層次

```
┌─────────────────────────────────────────┐
│        Application Level                │
│    (App Structure & Lifecycle)          │
├─────────────────────────────────────────┤
│         UI/Rendering Level              │
│      (Widget & Animation)               │
├─────────────────────────────────────────┤
│          Data Level                     │
│    (Storage, Cache, Network)            │
├─────────────────────────────────────────┤
│        Platform Level                   │
│   (Native Optimization & Resources)     │
└─────────────────────────────────────────┘
```

### 1.3 效能監控策略

**即時效能監控**：
- 幀率監控 (FPS Monitoring)
- 記憶體使用追蹤
- CPU 使用率監控
- 網路請求效能分析
- 啟動時間測量

**使用者體驗指標**：
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

## 2. 應用程式啟動最佳化

### 2.1 冷啟動最佳化

**啟動流程最佳化**：
```
Startup Optimization Strategy:
1. Essential Services First
   - 核心依賴注入
   - 最小化初始化配置
   - 延遲非關鍵服務

2. Parallel Initialization
   - 並行載入獨立組件
   - 異步初始化耗時服務
   - 背景預載入資源

3. Progressive Loading
   - 分階段載入功能模組
   - 懶載入非即時需要的組件
   - 按需載入大型資源
```

**啟動時間測量與最佳化**：
```
class StartupPerformanceMonitor {
  static final Stopwatch _startupTimer = Stopwatch();
  static final Map<String, int> _milestones = {};
  
  static void startMeasurement() {
    _startupTimer.start();