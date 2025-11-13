class MemoryCache<T> {
  MemoryCache({this.ttl = const Duration(minutes: 10)});

  final Duration ttl;
  final _cache = <String, _CacheEntry<T>>{};

  void set(String key, T value) {
    _cache[key] = _CacheEntry(value, DateTime.now().add(ttl));
  }

  T? get(String key) {
    final entry = _cache[key];
    if (entry == null) return null;
    if (DateTime.now().isAfter(entry.expiration)) {
      _cache.remove(key);
      return null;
    }
    return entry.value;
  }

  void invalidate(String key) => _cache.remove(key);
}

class _CacheEntry<T> {
  _CacheEntry(this.value, this.expiration);
  final T value;
  final DateTime expiration;
}
