/**
 * Resolve an asset path considering sub-directory deployments (e.g. Laragon /marports-global-new/public)
 * or root deployments (production / localhost:8000).
 */
export function resolveAsset(url) {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const clean = url.startsWith('/') ? url.slice(1) : url;

  if (typeof window !== 'undefined' && window.location.pathname.includes('/marports-global-new/public')) {
    return `/marports-global-new/public/${clean}`;
  }

  return `/${clean}`;
}
