import { useEffect, useRef } from 'react';
import { socketService } from '../services/socketService';

/**
 * Hook to track visitor typing status and send to backend
 * - Typing: When user is actively typing
 * - Stopped: When user stops typing for 2 seconds
 * - Idle: When user is inactive for 30 seconds
 */
export const useTypingStatus = () => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isTypingRef = useRef<boolean>(false);

  // Handle input change (typing)
  const handleInputChange = () => {
    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Notify typing if not already typing
    if (!isTypingRef.current) {
      socketService.notifyTyping();
      isTypingRef.current = true;
    }

    // Set timeout for stopped typing (2 seconds)
    typingTimeoutRef.current = setTimeout(() => {
      socketService.notifyStoppedTyping();
      isTypingRef.current = false;
    }, 2000);

    // Set timeout for idle (30 seconds)
    idleTimeoutRef.current = setTimeout(() => {
      socketService.notifyIdle();
      isTypingRef.current = false;
    }, 30000);
  };

  // Setup global event listeners
  useEffect(() => {
    // Listen to all input, textarea, and select changes
    const handleInput = () => handleInputChange();
    const handleClick = () => handleInputChange();
    const handleKeyPress = () => handleInputChange();

    document.addEventListener('input', handleInput);
    document.addEventListener('click', handleClick);
    document.addEventListener('keypress', handleKeyPress);

    // Initial idle timeout
    idleTimeoutRef.current = setTimeout(() => {
      socketService.notifyIdle();
    }, 30000);

    // Cleanup
    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keypress', handleKeyPress);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, []);

  return { handleInputChange };
};
