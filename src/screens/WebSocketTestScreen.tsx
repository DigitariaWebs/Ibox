import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button } from '../ui';
import { WebSocketStatus } from '../components/WebSocketStatus';
import { useUserSync } from '../hooks/useUserSync';
import { useAuthContext } from '../contexts/AuthContext';

export default function WebSocketTestScreen() {
  const { user: authUser } = useAuthContext();
  const { status, syncUserProfile, syncFromFirebaseAuth, pingServer } = useUserSync();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testPing = async () => {
    try {
      addTestResult('Testing ping...');
      pingServer();
      addTestResult('✅ Ping sent successfully');
    } catch (error: any) {
      addTestResult(`❌ Ping failed: ${error.message}`);
    }
  };

  const testSync = async () => {
    try {
      addTestResult('Testing Firebase sync...');
      await syncFromFirebaseAuth();
      addTestResult('✅ Firebase sync completed');
    } catch (error: any) {
      addTestResult(`❌ Firebase sync failed: ${error.message}`);
    }
  };

  const testProfileUpdate = async () => {
    try {
      addTestResult('Testing profile update...');
      await syncUserProfile({
        profile: {
          firstName: 'Test',
          lastName: 'User',
          preferences: {
            notifications: true,
            language: 'en',
            timezone: 'UTC',
          },
        },
      });
      addTestResult('✅ Profile update sent successfully');
    } catch (error: any) {
      addTestResult(`❌ Profile update failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    clearResults();
    addTestResult('🧪 Starting comprehensive tests...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testPing();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testSync();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testProfileUpdate();
    
    addTestResult('🏁 All tests completed');
  };

  useEffect(() => {
    if (status.error) {
      addTestResult(`❌ WebSocket error: ${status.error}`);
    }
  }, [status.error]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>WebSocket Sync Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <WebSocketStatus showDetails={true} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Info</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Auth User: {authUser?.email || 'Not authenticated'}
          </Text>
          <Text style={styles.infoText}>
            WebSocket User: {status.user?.email || 'Not synced'}
          </Text>
          <Text style={styles.infoText}>
            Provider: {status.user?.signInProvider || 'Unknown'}
          </Text>
          <Text style={styles.infoText}>
            Last Active: {status.user?.lastActiveAt || 'Never'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Tests</Text>
        <View style={styles.buttonRow}>
          <Button 
            title="Ping Server" 
            onPress={testPing} 
            disabled={!status.isConnected || status.isSyncing}
            style={styles.testButton}
          />
          <Button 
            title="Sync Firebase" 
            onPress={testSync} 
            disabled={!status.isConnected || status.isSyncing}
            style={styles.testButton}
          />
        </View>
        <View style={styles.buttonRow}>
          <Button 
            title="Update Profile" 
            onPress={testProfileUpdate} 
            disabled={!status.isConnected || status.isSyncing}
            style={styles.testButton}
          />
          <Button 
            title="Run All Tests" 
            onPress={runAllTests} 
            disabled={!status.isConnected || status.isSyncing}
            style={styles.testButton}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <Button 
            title="Clear" 
            onPress={clearResults} 
            style={styles.clearButton}
          />
        </View>
        <View style={styles.resultsBox}>
          {testResults.length === 0 ? (
            <Text style={styles.noResults}>No test results yet</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Info</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Connection: {status.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
          <Text style={styles.infoText}>
            Syncing: {status.isSyncing ? '🟡 In Progress' : '⚪ Idle'}
          </Text>
          <Text style={styles.infoText}>
            Last Sync: {status.lastSyncAt?.toLocaleString() || 'Never'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#374151',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  testButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    paddingHorizontal: 16,
  },
  resultsBox: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    minHeight: 200,
    maxHeight: 300,
  },
  noResults: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 60,
  },
  resultText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});