import 'dart:async';

import '../../core/error/error_handler.dart';
import '../../shared/models/scan_item.dart';
import '../events/events.dart';

class GalleryService {
  GalleryService({required this.errorHandler});

  final ErrorHandler errorHandler;
  final _imageSelectionController = StreamController<ImageSelectedEvent>.broadcast();

  Stream<ImageSelectedEvent> get onImageSelected => _imageSelectionController.stream;

  Future<ScanItem> selectImage() async {
    return errorHandler.guard(() async {
      final item = ScanItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        filePath: '/tmp/gallery_${DateTime.now().millisecondsSinceEpoch}.jpg',
        createdAt: DateTime.now(),
        status: ScanStatus.pending,
      );
      _imageSelectionController.add(ImageSelectedEvent(item));
      return item;
    });
  }

  void dispose() {
    _imageSelectionController.close();
  }
}
