import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SESSION_KEY = 'louder_analytics_session';

const getSessionId = () => {
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const sessionId = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return 'anonymous';
  }
};

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin-portal-secret')) return;

    const payload = JSON.stringify({
      path: `${location.pathname}${location.search}`,
      title: document.title,
      referrer: document.referrer,
      sessionId: getSessionId(),
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/pageview', blob);
      return;
    }

    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // Analytics should never interrupt the public site.
    });
  }, [location.pathname, location.search]);

  return null;
}
