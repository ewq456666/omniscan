import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../business_logic/services/processing_service.dart';
import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';

class ProcessingViewState {
  const ProcessingViewState({
    this.status = ScanStatus.pending,
    this.result,
  });

  final ScanStatus status;
  final ExtractedData? result;

  ProcessingViewState copyWith({
    ScanStatus? status,
    ExtractedData? result,
  }) {
    return ProcessingViewState(
      status: status ?? this.status,
      result: result ?? this.result,
    );
  }
}

class ProcessingController extends StateNotifier<ProcessingViewState> {
  ProcessingController({required this.processingService})
      : super(const ProcessingViewState()) {
    processingService.statusStream.listen((event) {
      state = state.copyWith(status: event.status);
    });
    processingService.resultsStream.listen((event) {
      state = state.copyWith(result: event.data);
    });
  }

  final ProcessingService processingService;

  Future<void> startProcessing(ScanItem item) async {
    state = state.copyWith(status: ScanStatus.processing);
    await processingService.processScan(item);
  }
}
