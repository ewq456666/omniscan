class ExtractedData {
  const ExtractedData({
    required this.scanId,
    required this.fields,
    this.summary,
  });

  final String scanId;
  final Map<String, dynamic> fields;
  final String? summary;
}
