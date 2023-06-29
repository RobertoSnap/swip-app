import React, { useCallback, useEffect, useState } from 'react';
import '@walletconnect/react-native-compat';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { ProposalTypes, SignClientTypes, Verify } from '@walletconnect/types';
import { Button, TextInput, StyleSheet } from 'react-native';
import { useWallet } from '../state/useWallet';
import QrScanner from './QrScanner';

const buttonStyle = {
  height: 40,
  borderColor: 'gray',
  borderWidth: 1,
  padding: 10,
};

type ApproveEvent = {
  verifyContext: Verify.Context;
} & Omit<SignClientTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;


export default function Connect() {
  const { client } = useWallet();
  const [connectionString, setConnectionString] = useState<string>();
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const pair = async (uri?: string) => {
    if (!client) {
      throw Error('No client found')
    }
    if (!uri) {
      throw Error('No connection string provided');
    }
    const res = await client.core.pairing.pair({ uri });
    setShowCamera(false)
    console.log(res);
  };

  return (
    <>
      <TextInput
        value={connectionString}
        placeholder="Enter connection string"
        style={styles.input}
        onChangeText={text => setConnectionString(text)}
      />
      <Button title="Connect" onPress={() => pair(connectionString)} color={styles.button.backgroundColor} />
      <Button title="Scan with camera" onPress={() => setShowCamera(!showCamera)} color={styles.button.backgroundColor} />
      {showCamera && <QrScanner onScan={(uri) => pair(uri)}></QrScanner>}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  qrScanner: {
    width: '100%',
  },
});

