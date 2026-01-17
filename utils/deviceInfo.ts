import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  city: string;
  userAgent: string;
}

// Get device information using UAParser
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  const parser = new UAParser();
  const result = parser.getResult();

  // Get User Agent
  const userAgent = navigator.userAgent;

  // Get Browser info
  const browser = `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim();

  // Get OS info
  const os = `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim();

  // Get Device type
  let device = 'Desktop';
  if (result.device.type === 'mobile') {
    device = 'Mobile';
  } else if (result.device.type === 'tablet') {
    device = 'Tablet';
  }

  // Get IP and Location info
  let ipAddress = 'Unknown';
  let country = 'Unknown';
  let city = 'Unknown';

  try {
    // Use Backend proxy to avoid CORS issues
    const response = await fetch('http://qa-data-center.com/api/visitor/ip-info');
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        ipAddress = result.data.ip || 'Unknown';
        country = result.data.country_name || 'Unknown';
        city = result.data.city || 'Unknown';
      }
    }
  } catch (error) {
    // Fallback: IP info will be Unknown (no console error)
    // This is acceptable as device info is still captured
  }

  return {
    ipAddress,
    browser,
    os,
    device,
    country,
    city,
    userAgent,
  };
};
