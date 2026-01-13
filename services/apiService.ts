import { API_ENDPOINTS } from '../config';

class ApiService {
  // Save visitor data via REST API
  async saveVisitorData(sessionId: string, formData: any, page: string): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.visitor.saveData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          formData,
          page,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving visitor data:', error);
      throw error;
    }
  }

  // Join as visitor via REST API
  async joinAsVisitor(sessionId: string, page: string): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.visitor.join, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          page,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error joining as visitor:', error);
      throw error;
    }
  }

  // Track page change via REST API
  async trackPageChange(sessionId: string, page: string): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.visitor.pageChange, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          page,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error tracking page change:', error);
      throw error;
    }
  }

  // Get active visitors (Admin)
  async getActiveVisitors(): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.admin.activeVisitors, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting active visitors:', error);
      throw error;
    }
  }

  // Redirect visitor (Admin)
  async redirectVisitor(sessionId: string, targetPage: string): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.admin.redirectVisitor, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          targetPage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error redirecting visitor:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(API_ENDPOINTS.health, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
