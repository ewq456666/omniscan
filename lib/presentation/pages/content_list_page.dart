import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../state/providers.dart';
import '../widgets/scan_item_card.dart';
import '../widgets/status_indicator.dart';

class ContentListPage extends ConsumerWidget {
  const ContentListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(contentControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Content')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: () => ref.read(contentControllerProvider.notifier).loadContent(),
              child: const Text('Refresh'),
            ),
            const SizedBox(height: 24),
            if (state.isLoading) const StatusIndicator(message: 'Loading...'),
            Expanded(
              child: ListView.builder(
                itemCount: state.items.length,
                itemBuilder: (context, index) {
                  final item = state.items[index];
                  return ScanItemCard(
                    item: item,
                    onOpen: () => ref.read(resultsControllerProvider.notifier).loadResult(item.id),
                    onDelete: () => ref.read(contentControllerProvider.notifier).removeItem(item.id),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
