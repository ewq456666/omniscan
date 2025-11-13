import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../business_logic/services/content_management_service.dart';
import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';

class ContentViewState {
  const ContentViewState({
    this.items = const [],
    this.isLoading = false,
  });

  final List<ScanItem> items;
  final bool isLoading;

  ContentViewState copyWith({
    List<ScanItem>? items,
    bool? isLoading,
  }) {
    return ContentViewState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class ContentController extends StateNotifier<ContentViewState> {
  ContentController({required this.service}) : super(const ContentViewState());

  final ContentManagementService service;

  Future<void> loadContent() async {
    state = state.copyWith(isLoading: true);
    final items = await service.loadRecentScans();
    state = state.copyWith(isLoading: false, items: items);
  }

  Future<void> removeItem(String id) async {
    await service.deleteScan(id);
    await loadContent();
  }

  Future<void> saveContent(ExtractedData data) async {
    await service.saveContent(data);
    await loadContent();
  }
}
