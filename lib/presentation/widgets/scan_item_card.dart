import 'package:flutter/material.dart';

import '../../shared/models/scan_item.dart';

class ScanItemCard extends StatelessWidget {
  const ScanItemCard({
    required this.item,
    required this.onOpen,
    required this.onDelete,
    super.key,
  });

  final ScanItem item;
  final VoidCallback onOpen;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        title: Text(item.filePath),
        subtitle: Text('Status: ${item.status.name}'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.open_in_new),
              onPressed: onOpen,
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: onDelete,
            ),
          ],
        ),
      ),
    );
  }
}
