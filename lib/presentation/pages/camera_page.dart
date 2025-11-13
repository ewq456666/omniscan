import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../state/providers.dart';
import '../widgets/status_indicator.dart';

class CameraPage extends ConsumerWidget {
  const CameraPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(cameraControllerProvider);
    final controller = ref.read(cameraControllerProvider.notifier);
    return Scaffold(
      appBar: AppBar(title: const Text('Camera')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ElevatedButton(
              onPressed: controller.capturePhoto,
              child: const Text('Capture Photo'),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: controller.selectFromGallery,
              child: const Text('Select from Gallery'),
            ),
            const SizedBox(height: 24),
            if (state.isProcessing) const StatusIndicator(message: 'Processing...'),
            if (state.currentItem != null)
              Text('Current item: ${state.currentItem!.filePath}', style: Theme.of(context).textTheme.bodyLarge),
          ],
        ),
      ),
    );
  }
}
