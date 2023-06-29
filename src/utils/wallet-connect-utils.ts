
import React from 'react';
import '@walletconnect/react-native-compat';
import Constants from 'expo-constants'
import SignClient from '@walletconnect/sign-client';


export async function createWalletConnectClient() {
  try {
    if (!Constants.expoConfig?.extra?.WALLET_CONNECT_PROJECT_ID) {
      throw Error('No WALLET_CONNECT_PROJECT_ID in app.json')
    }
    if (!Constants.expoConfig?.extra?.WALLET_CONNECT_RELAY_URL) {
      throw Error('No WALLET_CONNECT_RELAY_URL in app.json')
    }
    const client = await SignClient.init({
      projectId: Constants.expoConfig.extra.WALLET_CONNECT_PROJECT_ID,
      relayUrl: Constants.expoConfig.extra.WALLET_CONNECT_RELAY_URL,
      metadata: {
        description: "SWIP app",
        url: "#",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
        name: "SWIP",
      }
    });
    return client
  } catch (e) {
    console.log(e);
    throw e
  }
}

//   async function subscribeToEvents(client: SignClient) {
//     if (!client) {
//       throw Error('No events to subscribe to b/c the client does not exist');
//     }

//     try {
//       client.on('session_delete', () => {
//         console.log('user disconnected the session from their wallet');
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }