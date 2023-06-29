import '@walletconnect/react-native-compat';
import { SessionTypes } from '@walletconnect/types';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useWallet } from '../state/useWallet';

export default function Sessions() {
  const { sessions } = useWallet();

  useEffect(() => {
    console.log('sessions', sessions);
  }, [sessions]);

  const renderItem = ({ item }: { item: SessionTypes.Struct }) => (
    <View>
      <Text>Topic: {item.topic}</Text>
      <Text>Pairing Topic: {item.pairingTopic}</Text>
      <Text>Controller: {item.controller}</Text>
      <Text>Session Properties: {JSON.stringify(item.sessionProperties)}</Text>
      <Text>Self Public Key: {item.self.publicKey}</Text>
      <Text>Peer Public Key: {item.peer.publicKey}</Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
}
