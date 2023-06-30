import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import '@walletconnect/react-native-compat';

import { useWallet } from '../state/useWallet';
import QrScanner from '../components/QrScanner';
import { BottomTabScreenProps, } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export default function Scan() {
  const { init, ready, activeSession, client, handleApproveSession, handleSessionRequest } = useWallet()
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const navigation = useNavigation();


  const pair = async (uri?: string) => {
    if (!client) {
      throw Error('No client found')
    }
    if (!uri) {
      throw Error('No connection string provided');
    }
    const res = await client.core.pairing.pair({ uri });
    setShowCamera(false)
    navigation.goBack()
  };


  return (
    <View style={{ flex: 1 }}>
      {showCamera && ready && <QrScanner onScan={(uri) => pair(uri)}></QrScanner>}
    </View>
  );
}