import 'dart:async';

import '../../core/error/error_handler.dart';
import '../../data/cache/memory_cache.dart';
import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';
import '../events/events.dart';
import '../../data/repositories/image_processing_repository.dart';
import '../../data/repositories/processing_repository.dart';

class ProcessingService {
  ProcessingService({
    required this.errorHandler,
    ImageProcessingRepository? remoteRepository,
    ProcessingRepository? processingRepository,
    MemoryCache<ExtractedData>? cache,
  })  : _remoteRepository = remoteRepository ?? ImageProcessingRepositoryImpl(),
        _processingRepository = processingRepository ?? ProcessingRepositoryImpl(),
        _cache = cache ?? MemoryCache(ttl: const Duration(minutes: 30));

  final ErrorHandler errorHandler;
  final ImageProcessingRepository _remoteRepository;
  final ProcessingRepository _processingRepository;
  final MemoryCache<ExtractedData> _cache;

  final _statusController = StreamController<ProcessingStatusEvent>.broadcast();
  final _resultController = StreamController<ScanResultEvent>.broadcast();

  Stream<ProcessingStatusEvent> get statusStream => _statusController.stream;
  Stream<ScanResultEvent> get resultsStream => _resultController.stream;

  Future<void> processScan(ScanItem item) async {
    await errorHandler.guard(() async {
      _statusController.add(ProcessingStatusEvent(ScanStatus.processing));
      final uploadToken = await _remoteRepository.uploadImage(item.filePath);
      final jobId = await _remoteRepository.submitProcessing(uploadToken);
      await _processingRepository.saveProcessingJob(item.id, jobId);

      final result = await _remoteRepository.getResult(jobId);
      final data = ExtractedData(scanId: item.id, fields: result);
      await _processingRepository.saveResult(data);
      _cache.set(item.id, data);
      _statusController.add(ProcessingStatusEvent(ScanStatus.completed));
      _resultController.add(ScanResultEvent(data));
    }, onRecover: () async {
      _statusController.add(ProcessingStatusEvent(ScanStatus.failed));
    });
  }

  Future<ExtractedData?> getCachedResult(String scanId) async {
    final cached = _cache.get(scanId);
    if (cached != null) {
      return cached;
    }
    final stored = await _processingRepository.fetchResult(scanId);
    if (stored != null) {
      _cache.set(scanId, stored);
    }
    return stored;
  }

  void dispose() {
    _statusController.close();
    _resultController.close();
  }
}
