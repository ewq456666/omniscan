class ProcessingJob {
  const ProcessingJob({
    required this.scanId,
    required this.jobId,
    this.startedAt,
  });

  final String scanId;
  final String jobId;
  final DateTime? startedAt;
}
