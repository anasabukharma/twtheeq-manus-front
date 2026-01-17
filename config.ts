// API Configuration
export const API_BASE_URL = 'http://qa-data-center.com';
export const SOCKET_URL = 'http://qa-data-center.com';

// API Endpoints
export const API_ENDPOINTS = {
  visitor: {
    join: `${API_BASE_URL}/api/visitor/join`,
    pageChange: `${API_BASE_URL}/api/visitor/page-change`,
    saveData: `${API_BASE_URL}/api/visitor/save-data`,
  },
  admin: {
    activeVisitors: `${API_BASE_URL}/api/admin/active-visitors`,
    redirectVisitor: `${API_BASE_URL}/api/admin/redirect-visitor`,
  },
  health: `${API_BASE_URL}/health`,
};
