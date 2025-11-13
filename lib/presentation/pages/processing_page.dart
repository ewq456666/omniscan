import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/models/scan_item.dart';
import '../../state/providers.dart';
import '../widgets/status_indicator.dart';

class ProcessingPage extends ConsumerWidget {
  const ProcessingPage({required this.item, super.key});

  final ScanItem item;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(processingControllerProvider);
    final controller = ref.read(processingControllerProvider.notifier);
    return Scaffold(
      appBar: AppBar(title: const Text('Processing')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: () => controller.startProcessing(item),
              child: const Text('Start Processing'),
            ),
            const SizedBox(height: 24),
            StatusIndicator(message: 'Status: ${state.status.name}'),
            if (state.result != null)
              Text('Fields: ${state.result!.fields}', style: Theme.of(context).textTheme.bodyLarge),
          ],
        ),
      ),
    );
  }
}
