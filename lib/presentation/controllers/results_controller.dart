import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../business_logic/services/results_display_service.dart';
import '../../shared/models/extracted_data.dart';

class ResultsViewState {
  const ResultsViewState({this.data, this.isLoading = false});

  final ExtractedData? data;
  final bool isLoading;

  ResultsViewState copyWith({
    ExtractedData? data,
    bool? isLoading,
  }) {
    return ResultsViewState(
      data: data ?? this.data,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class ResultsController extends StateNotifier<ResultsViewState> {
  ResultsController({required this.service}) : super(const ResultsViewState());

  final ResultsDisplayService service;

  Future<void> loadResult(String scanId) async {
    state = state.copyWith(isLoading: true);
    final data = await service.fetchResult(scanId);
    state = state.copyWith(isLoading: false, data: data);
  }
}
