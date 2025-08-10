import { useEffect, useState } from 'react';
import { useWebSocket, useWebSocketActions } from '../contexts/WebSocketContext';
import { useAuthContext } from '../contexts/AuthContext';

export interface UserSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  user: any | null;
}

export const useUserSync = () => {
  const { socket, isConnected, error, user } = useWebSocket();
  const { updateProfile, syncFromFirebase, ping } = useWebSocketActions();
  const { user: authUser } = useAuthContext();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  const syncUserProfile = async (profileData: any) => {
    if (!isConnected) {
      throw new Error('WebSocket not connected');
    }

    setIsSyncing(true);
    try {
      updateProfile(profileData);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncFromFirebaseAuth = async () => {
    if (!isConnected) {
      throw new Error('WebSocket not connected');
    }

    setIsSyncing(true);
    try {
      syncFromFirebase();
      setLastSyncAt(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const pingServer = () => {
    if (isConnected) {
      ping();
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleUserSynced = (data: any) => {
      console.log('User sync completed:', data);
      setLastSyncAt(new Date());
      setIsSyncing(false);
    };

    const handleProfileUpdated = (data: any) => {
      console.log('Profile updated:', data);
      setLastSyncAt(new Date());
      setIsSyncing(false);
    };

    const handleBroadcastUpdate = (data: any) => {
      console.log('Received broadcast update:', data);
      
      if (data.type === 'user_sync_complete') {
        setLastSyncAt(new Date());
      }
    };

    socket.on('user:synced', handleUserSynced);
    socket.on('user:profile_updated', handleProfileUpdated);
    socket.on('user:broadcast_update', handleBroadcastUpdate);

    return () => {
      socket.off('user:synced', handleUserSynced);
      socket.off('user:profile_updated', handleProfileUpdated);
      socket.off('user:broadcast_update', handleBroadcastUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (isConnected && authUser && !user) {
      console.log('WebSocket connected but no user data, initiating sync...');
      syncFromFirebaseAuth().catch(console.error);
    }
  }, [isConnected, authUser, user]);

  const status: UserSyncStatus = {
    isConnected,
    isSyncing,
    lastSyncAt,
    error,
    user,
  };

  return {
    status,
    syncUserProfile,
    syncFromFirebaseAuth,
    pingServer,
  };
};