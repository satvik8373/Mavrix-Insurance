export const getApiBase = () => {
  const env = process.env.REACT_APP_API_URL;

  let base;
  if (env && env.trim().length > 0) {
    base = env.trim();
  } else if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('localhost:3000')) {
      base = 'http://localhost:5000';
    } else {
      base = origin; // same-origin when deployed
    }
  } else {
    base = 'http://localhost:5000';
  }

  // Normalize: remove trailing slash
  base = base.replace(/\/$/, '');

  // Ensure /api suffix
  if (!base.endsWith('/api')) {
    base = base + '/api';
  }

  return base;
};
