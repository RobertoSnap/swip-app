import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import '@walletconnect/react-native-compat';

import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useWallet } from '../state/useWallet';
import { StatusBar } from 'expo-status-bar';
import Settings from '../tabs/Settings';
import Scan from '../tabs/Scan';
import Request from '../tabs/Requests';
import { useNavigation, } from '@react-navigation/native';
import Credentials from '../tabs/Crendentials';

export type TabNavigationParams = {
  Scan: undefined,
  Settings: undefined // Define an object of navigation params if you need it Jon :)
  Credentials: undefined
  Requests: undefined
};
const Tab = createBottomTabNavigator<TabNavigationParams>();

export default function Home() {
  const { init, ready, activeSession, client, handleApproveSession, handleSessionRequest, requests: request } = useWallet()
  const navigation = useNavigation<BottomTabNavigationProp<TabNavigationParams>>();

  // listen to all wallet connect events
  useEffect(() => {
    if (!client) return
    client.on('session_proposal', handleApproveSession);
    client.on('session_request', handleSessionRequest);
    return () => {
      client.removeAllListeners('session_proposal');
      client.removeAllListeners('session_request');
    };
  }, [client]);

  // connect on mount
  useEffect(() => {
    init()
  }, []);

  useEffect(() => {
    if (request.length > 0) {
      navigation.navigate("Requests", undefined)
    }
  }, [request])


  return (
    <View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-between' }}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <StatusBar style="auto" />
        <Text>WalletConnect ready: {ready ? 'Yes' : 'No'} </Text>
        <Text>Active session: {activeSession ? 'Yes' : 'No'} </Text>
      </View>

      <View style={{ flex: 1 }}>
        <Tab.Navigator initialRouteName='Credentials'>
          <Tab.Screen name="Settings" component={Settings} />
          <Tab.Screen name="Scan" component={Scan} />
          <Tab.Screen name="Credentials" component={Credentials} />
          <Tab.Screen name="Requests" component={Request} />
        </Tab.Navigator>
      </View>
    </View>
  );
}