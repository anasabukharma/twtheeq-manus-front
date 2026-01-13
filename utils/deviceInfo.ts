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
    // Use ipapi.co for IP and location (free, no API key required)
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      ipAddress = data.ip || 'Unknown';
      country = data.country_name || 'Unknown';
      city = data.city || 'Unknown';
    }
  } catch (error) {
    console.error('Failed to fetch IP and location:', error);
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
