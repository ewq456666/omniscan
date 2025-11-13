import '../../core/error/error_handler.dart';
import '../../data/repositories/scan_item_repository.dart';
import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';
import '../events/events.dart';

class ContentManagementService {
  ContentManagementService({
    required this.errorHandler,
    ScanItemRepository? repository,
  }) : _repository = repository ?? ScanItemRepositoryImpl();

  final ErrorHandler errorHandler;
  final ScanItemRepository _repository;

  Future<List<ScanItem>> loadRecentScans() {
    return errorHandler.guard(() => _repository.fetchRecentScans());
  }

  Future<void> saveContent(ExtractedData data) {
    return errorHandler.guard(() async {
      await _repository.saveExtractedData(data);
    });
  }

  Future<void> deleteScan(String id) {
    return errorHandler.guard(() => _repository.deleteScan(id));
  }
}
