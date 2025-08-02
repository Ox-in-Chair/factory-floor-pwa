const LICENCE_KEY = "paid_license_token";

export function hasLicence(): boolean {
  return !!localStorage.getItem(LICENCE_KEY);
}

export function grantMockLicence() {
  const token = JSON.stringify({
    device: "offline-device",
    supervisorInitial: "M",
    purchasedAt: new Date().toISOString(),
    sessionId: "mock-session",
    amount: 999,
    currency: "usd"
  });
  localStorage.setItem(LICENCE_KEY, token);
}

export function getLicence() {
  return localStorage.getItem(LICENCE_KEY);
}
