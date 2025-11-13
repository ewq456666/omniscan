import '../../data/repositories/scan_item_repository.dart';
import '../../shared/models/scan_item.dart';

class SynchronizationService {
  SynchronizationService({ScanItemRepository? repository})
      : _repository = repository ?? ScanItemRepositoryImpl();

  final ScanItemRepository _repository;

  Future<void> synchronize(List<ScanItem> remoteItems) async {
    final localItems = await _repository.fetchRecentScans();
    final remoteIds = remoteItems.map((e) => e.id).toSet();
    final localIds = localItems.map((e) => e.id).toSet();

    for (final item in remoteItems) {
      await _repository.saveScanItem(item);
    }

    for (final id in localIds.difference(remoteIds)) {
      await _repository.deleteScan(id);
    }
  }
}
