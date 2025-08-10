import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  user: any | null;
  reconnect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  serverUrl = 'http://localhost:8080' 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const { user: authUser } = useAuthContext();

  const createSocket = async () => {
    try {
      if (!authUser) {
        console.log('WebSocket: No authenticated user, skipping connection');
        return;
      }

      const token = await authUser.getIdToken();
      
      console.log('WebSocket: Creating connection to', serverUrl);
      
      const newSocket = io(serverUrl, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('WebSocket: Connected successfully');
        setIsConnected(true);
        setError(null);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('WebSocket: Disconnected:', reason);
        setIsConnected(false);
        setUser(null);
      });

      newSocket.on('connect_error', (err) => {
        console.error('WebSocket: Connection error:', err.message);
        setError(`Connection failed: ${err.message}`);
        setIsConnected(false);
      });

      newSocket.on('auth_error', (data) => {
        console.error('WebSocket: Authentication error:', data.message);
        setError(`Authentication failed: ${data.message}`);
        setIsConnected(false);
      });

      newSocket.on('authenticated', (data) => {
        console.log('WebSocket: Authenticated successfully');
        setUser(data.user);
        setError(null);
      });

      newSocket.on('user:status', (data) => {
        console.log('WebSocket: User status update:', data);
      });

      newSocket.on('user:profile_updated', (data) => {
        console.log('WebSocket: Profile updated:', data);
        setUser(data.user);
      });

      newSocket.on('user:synced', (data) => {
        console.log('WebSocket: User synced from Firebase:', data);
        setUser(data.user);
      });

      newSocket.on('user:broadcast_update', (data) => {
        console.log('WebSocket: Broadcast update received:', data);
      });

      newSocket.on('user:pong', (data) => {
        console.log('WebSocket: Pong received:', data);
      });

      newSocket.on('error', (data) => {
        console.error('WebSocket: Server error:', data.message);
        setError(data.message);
      });

      setSocket(newSocket);

      return newSocket;
    } catch (err: any) {
      console.error('WebSocket: Error creating socket:', err);
      setError(`Failed to create connection: ${err.message}`);
      return null;
    }
  };

  const disconnect = () => {
    if (socket) {
      console.log('WebSocket: Disconnecting...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setUser(null);
      setError(null);
    }
  };

  const reconnect = async () => {
    console.log('WebSocket: Manual reconnection requested');
    disconnect();
    setTimeout(() => {
      createSocket();
    }, 1000);
  };

  useEffect(() => {
    if (authUser) {
      createSocket();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [authUser, serverUrl]);

  const contextValue: WebSocketContextType = {
    socket,
    isConnected,
    error,
    user,
    reconnect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const useWebSocketActions = () => {
  const { socket, isConnected } = useWebSocket();

  const updateProfile = (profileData: any) => {
    if (socket && isConnected) {
      socket.emit('user:update_profile', profileData);
    }
  };

  const syncFromFirebase = () => {
    if (socket && isConnected) {
      socket.emit('user:sync_from_firebase');
    }
  };

  const ping = () => {
    if (socket && isConnected) {
      socket.emit('user:ping');
    }
  };

  return {
    updateProfile,
    syncFromFirebase,
    ping,
  };
};