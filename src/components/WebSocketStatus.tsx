import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../ui';
import { useUserSync } from '../hooks/useUserSync';

interface WebSocketStatusProps {
  showDetails?: boolean;
  onStatusPress?: () => void;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  showDetails = false,
  onStatusPress,
}) => {
  const { status, syncFromFirebaseAuth, pingServer } = useUserSync();

  const getStatusColor = () => {
    if (status.error) return '#EF4444';
    if (status.isSyncing) return '#F59E0B';
    if (status.isConnected) return '#10B981';
    return '#6B7280';
  };

  const getStatusText = () => {
    if (status.error) return 'Connection Error';
    if (status.isSyncing) return 'Syncing...';
    if (status.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const handleStatusPress = () => {
    if (onStatusPress) {
      onStatusPress();
    } else if (status.isConnected && !status.isSyncing) {
      pingServer();
    }
  };

  const handleSyncPress = () => {
    if (status.isConnected && !status.isSyncing) {
      syncFromFirebaseAuth();
    }
  };

  if (!showDetails) {
    return (
      <TouchableOpacity 
        style={[styles.indicator, { backgroundColor: getStatusColor() }]}
        onPress={handleStatusPress}
        disabled={status.isSyncing}
      >
        <Text style={styles.indicatorText}>●</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
        
        {status.isConnected && !status.isSyncing && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleSyncPress}
          >
            <Text style={styles.actionButtonText}>Sync</Text>
          </TouchableOpacity>
        )}
      </View>

      {status.error && (
        <Text style={styles.errorText}>{status.error}</Text>
      )}

      {status.lastSyncAt && (
        <Text style={styles.lastSyncText}>
          Last sync: {status.lastSyncAt.toLocaleTimeString()}
        </Text>
      )}

      {status.user && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            User: {status.user.displayName || status.user.email}
          </Text>
          <Text style={styles.userInfoSubtext}>
            Provider: {status.user.signInProvider}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  container: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginBottom: 4,
  },
  lastSyncText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  userInfoSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});