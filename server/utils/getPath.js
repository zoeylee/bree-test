export default function getPath(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return null;
  }

  if (urlString.indexOf('?') === -1) {
    return urlString;
  }

  return urlString.slice(0, urlString.indexOf('?'));
}
