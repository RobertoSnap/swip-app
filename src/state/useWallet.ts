import React from 'react';
import '@walletconnect/react-native-compat';
import { ethers } from 'ethers';
import { create, } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createWalletConnectClient } from '../utils/wallet-connect-utils';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { ProposalTypes, SessionTypes, SignClientTypes, Verify } from '@walletconnect/types';
import * as didJWT from 'did-jwt';

interface State {
  secret: string | undefined;
  ready: boolean;
  activeSession: boolean;
  client: SignClient | undefined;
  sessions: SessionTypes.Struct[]
  jwt_unverified: string[]
  jwt_verified: string[]
  createWallet: () => void;
  getWallet: () => ethers.Wallet | undefined;
  init: () => void;
  handleApproveSession: (event: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
  handleSessionRequest: (event: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
}
// export const useStore = create<State & Action>(persist(set => (
//     {
//         secret: '',
//         updateSecret: (secret) =>{
//             returnset({secret});
//         },
//     }
// ), {name: 'wallet-connect-state'}));

export const useWallet = create<State>()(
  persist(
    (set, get) => ({
      secret: undefined,
      ready: false,
      activeSession: false,
      client: undefined,
      sessions: [],
      jwt_unverified: [],
      jwt_verified: [],
      getWallet: () => {
        const secret = get().secret;
        if (!secret) {
          return undefined;
        } else {
          return new ethers.Wallet(secret);
        }
      },
      createWallet: () => {
        console.log("Creating wallet")
        const privateKey = ethers.Wallet.createRandom().privateKey;
        return set({ secret: privateKey });
      },
      init: async () => {
        const client = await createWalletConnectClient();
        return set(() => {
          return { client: client, ready: true };
        });
      },
      handleApproveSession: async (event: SignClientTypes.EventArguments["session_proposal"]) => {
        console.log('Start approve pairing, id: ', event.id);
        const client = get().client;
        if (!client) {
          throw Error('No client found')
        }
        let wallet = get().getWallet()
        if (!wallet) {
          get().createWallet();
          wallet = get().getWallet()
          if (!wallet) {
            throw Error('No wallet found');
          }
        }
        const { topic, acknowledged } = await client.approve({
          id: event.id,
          namespaces: {
            eip155: {
              accounts: [`eip155:5:${wallet.address}`],
              methods: ['personal_sign', 'eth_sendTransaction', 'request_credential', "receive_credential"],
              events: ['accountsChanged'],
            },
          },
        });
        console.log('Session approved, topic:', topic);

        const session = await acknowledged();
        console.log('Session acknowledged, session:', session);
        const sessions = get().sessions;
        return set({ activeSession: true, sessions: [...sessions, session] });
      },
      handleSessionRequest: async (event: SignClientTypes.EventArguments["session_request"]) => {
        console.log('Start session request id: ', event.id);
        const client = get().client;
        if (!client) {
          throw Error('No client found')
        }
        console.log("event.params.request", event.params.request)
        if (event.params.request.method === "receive_credential") {
          if (Array.isArray(event.params.request.params)) {
            const jwt = event.params.request.params[0];
            if (typeof jwt === "string") {
              try {
                didJWT.decodeJWT(jwt);
                return set({ jwt_unverified: [...get().jwt_unverified, jwt] });
              } catch (error) {
                console.log(error)
              }
            }
          }
        }
      }
    }),
    {
      name: 'wallet-state', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default the 'localStorage' is used
      partialize: state => ({ secret: state.secret }),
    },
  ),
);
