import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../state/providers.dart';
import '../widgets/scan_item_card.dart';
import '../widgets/status_indicator.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final contentState = ref.watch(contentControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('OmniScan')),
      body: RefreshIndicator(
        onRefresh: () => ref.read(contentControllerProvider.notifier).loadContent(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            ElevatedButton(
              onPressed: () => ref.read(homeControllerProvider).startCameraFlow(),
              child: const Text('Capture Photo'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => ref.read(homeControllerProvider).startGalleryFlow(),
              child: const Text('Select from Gallery'),
            ),
            const SizedBox(height: 24),
            if (contentState.isLoading) const StatusIndicator(message: 'Loading recent scans...'),
            ...contentState.items.map(
              (item) => ScanItemCard(
                item: item,
                onOpen: () {
                  ref.read(resultsControllerProvider.notifier).loadResult(item.id);
                },
                onDelete: () {
                  ref.read(contentControllerProvider.notifier).removeItem(item.id);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
