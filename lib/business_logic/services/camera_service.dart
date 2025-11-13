import 'dart:async';

import '../../core/error/error_handler.dart';
import '../../shared/models/scan_item.dart';
import '../events/events.dart';

class CameraService {
  CameraService({required this.errorHandler});

  final ErrorHandler errorHandler;
  final _photoStreamController = StreamController<PhotoCapturedEvent>.broadcast();

  Stream<PhotoCapturedEvent> get onPhotoCaptured => _photoStreamController.stream;

  Future<ScanItem> capturePhoto() async {
    return errorHandler.guard(() async {
      final item = ScanItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        filePath: '/tmp/photo_${DateTime.now().millisecondsSinceEpoch}.jpg',
        createdAt: DateTime.now(),
        status: ScanStatus.pending,
      );
      _photoStreamController.add(PhotoCapturedEvent(item));
      return item;
    });
  }

  Future<void> requestCameraPermission() async {}

  void dispose() {
    _photoStreamController.close();
  }
}
