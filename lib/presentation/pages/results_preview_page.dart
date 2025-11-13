import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../state/providers.dart';
import '../widgets/status_indicator.dart';

class ResultsPreviewPage extends ConsumerWidget {
  const ResultsPreviewPage({required this.scanId, super.key});

  final String scanId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(resultsControllerProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Results Preview')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: () => ref.read(resultsControllerProvider.notifier).loadResult(scanId),
              child: const Text('Load Result'),
            ),
            const SizedBox(height: 24),
            if (state.isLoading) const StatusIndicator(message: 'Loading result...'),
            if (state.data != null)
              Expanded(
                child: SingleChildScrollView(
                  child: Text(state.data!.fields.toString()),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
