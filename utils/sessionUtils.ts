// Generate unique session ID
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomStr}`;
}

// Get or create session ID from localStorage
export function getOrCreateSessionId(): string {
  const storageKey = 'twtheeq_session_id';
  
  // Check if session ID exists in localStorage
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

// Clear session ID
export function clearSessionId(): void {
  localStorage.removeItem('twtheeq_session_id');
}

// Map step number to page name
export function getPageName(step: number): string {
  const pageMap: { [key: number]: string } = {
    '-3': 'forgot-password',
    '-2': 'simple-login',
    0: 'home',
    1: 'step1-account-type',
    2: 'step2-personal-info',
    3: 'step3-credentials',
    4: 'step4-payment',
    5: 'step5-verification',
  };
  
  return pageMap[step] || `step-${step}`;
}
