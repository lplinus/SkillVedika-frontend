let footerData: any = null;
let isFetching = false;
const listeners = new Set<(data: any) => void>();

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/* --------------------------------
   Fetch once from backend
-------------------------------- */
async function fetchFooterSettings() {
  if (footerData || isFetching) return;

  isFetching = true;

  try {
    const res = await fetch(`${API_URL}/footer-settings`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) return;

    const json = await res.json();
    footerData = json?.data || json;

    // notify all subscribers
    listeners.forEach((cb) => cb(footerData));
  } catch {
    // silent fail – never spam console
  } finally {
    isFetching = false;
  }
}

/* --------------------------------
   Subscribe helper
-------------------------------- */
export function subscribeFooterSettings(
  callback: (data: any) => void
) {
  listeners.add(callback);

  // If data already fetched, emit immediately
  if (footerData) {
    callback(footerData);
  } else {
    fetchFooterSettings();
  }

  // cleanup
  return () => {
    listeners.delete(callback);
  };
}
