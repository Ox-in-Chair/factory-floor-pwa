const WORKER_BASE = 'https://factory-floor-licencev2.mike-e17.workers.dev'; // replace if your Worker URL differs

export async function createCheckoutSession(supervisorInitial: string) {
  const returnUrl = window.location.origin;
  const resp = await fetch(${WORKER_BASE}/create-checkout-session, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supervisorInitial, return_url: returnUrl })
  });
  const j = await resp.json();
  if (j.url) {
    window.location.href = j.url;
  } else {
    alert('Failed to create session');
    console.error(j);
  }
}

export async function verifySession(sessionId: string) {
  const resp = await fetch(${WORKER_BASE}/verify-session?session_id=);
  const j = await resp.json();
  if (j.licenceToken) {
    localStorage.setItem('paid_license_token', j.licenceToken);
    return true;
  }
  return false;
}
