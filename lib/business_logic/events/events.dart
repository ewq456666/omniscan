import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';

typedef EventCallback<T> = void Function(T event);

class PhotoCapturedEvent {
  PhotoCapturedEvent(this.item);
  final ScanItem item;
}

class ImageSelectedEvent {
  ImageSelectedEvent(this.item);
  final ScanItem item;
}

class ProcessingStatusEvent {
  ProcessingStatusEvent(this.status);
  final ScanStatus status;
}

class ScanResultEvent {
  ScanResultEvent(this.data);
  final ExtractedData data;
}

class SaveConfirmedEvent {
  SaveConfirmedEvent(this.item);
  final ScanItem item;
}

class ContentSavedEvent {
  ContentSavedEvent(this.data);
  final ExtractedData data;
}
