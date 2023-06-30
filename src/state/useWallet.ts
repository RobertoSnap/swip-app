import React from 'react';
import '@walletconnect/react-native-compat';
import "react-native-get-random-values"
import "@ethersproject/shims"
import { Wallet, ethers } from 'ethers';
import { create, } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createWalletConnectClient } from '../utils/wallet-connect-utils';
import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes, SignClientTypes } from '@walletconnect/types';
import * as didJWT from 'did-jwt';
import { JWTDecodedWithCredentialType } from '../utils/credential-types';

interface PersistedState {
  secret: string;
  receivedJWTs: string[]
}
interface State {
  secret: string;
  ready: boolean;
  activeSession: boolean;
  client: SignClient | undefined;
  sessions: SessionTypes.Struct[]
  receivedJWTs: string[]
  requests: SignClientTypes.EventArguments["session_request"][]
  createWallet: () => void;
  getWallet: () => Wallet | undefined;
  init: () => void;
  handleApproveSession: (event: SignClientTypes.EventArguments["session_proposal"]) => Promise<void>;
  handleSessionRequest: (event: SignClientTypes.EventArguments["session_request"]) => Promise<void>;
  // verifyJWT: (jwt: string) => Promise<didJWT.JWTVerified>;
  decodeJWT: (jwt: string) => JWTDecodedWithCredentialType;
  acceptJWT: (jwt: string) => void;
  approveRequest: (event: SignClientTypes.EventArguments["session_request"], response: any) => Promise<void>;
  declineRequest: (event: SignClientTypes.EventArguments["session_request"], message: string, data: any) => Promise<void>;
}



export const useWallet = create<State, [['zustand/persist', PersistedState]]>(
  persist(
    (set, get) => ({
      secret: "",
      ready: false,
      activeSession: false,
      client: undefined,
      sessions: [],
      receivedJWTs: [],
      requests: [],
      getWallet: () => {
        const secret = get().secret;
        if (!secret || secret === "") {
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
      decodeJWT: (jwt: string) => {
        try {
          const decoded = didJWT.decodeJWT(jwt);
          return decoded as JWTDecodedWithCredentialType
        } catch (error) {
          console.log("Error verifying JWT", error)
          throw new Error("Error verifying JWT");
        }
      },
      acceptJWT: (jwt: string) => {
        return set({ receivedJWTs: [...get().receivedJWTs, jwt] })
      },
      // verifyJWT: async (jwt: string) => {
      //   // TODO - Handle verification of JWT later. Must resolve and know aud etc.
      //   try {
      //     let resolver = new Resolver({ ...getResolver({ infuraProjectId: "217473ce815c4fb1821b52667fbfbcca" }) });
      //     let verificationResponse = await didJWT.verifyJWT(jwt, {
      //       resolver,
      //       audience: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74'
      //     })
      //     return verificationResponse
      //   } catch (error) {
      //     console.log("Error verifying JWT", error)
      //     throw new Error("Error verifying JWT");
      //   }
      // },
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
              accounts: [`eip155:5:${wallet}`],
              methods: ['personal_sign', 'eth_sendTransaction', 'request_credential', "receive_credential", "present_credential"],
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
        // receive_credential
        set({ requests: [...get().requests, event] })
      },
      approveRequest: async (event: SignClientTypes.EventArguments["session_request"], response: any) => {
        const client = get().client;
        if (!client) {
          throw Error('No client found')
        }
        if (event.params.request.method === "receive_credential") {

        }
        await client.respond({
          topic: event.topic,
          response: {
            jsonrpc: "2.0",
            id: event.id,
            result: response,
          }
        });
        set({ requests: get().requests.filter((r) => r.id !== event.id) })
      },
      declineRequest: async (event: SignClientTypes.EventArguments["session_request"], message: string, data: any) => {
        const client = get().client;
        if (!client) {
          throw Error('No client found')
        }
        await client.reject({
          id: event.id,
          reason: {
            code: 1,
            message,
            data
          }
        });
        set({ requests: get().requests.filter((r) => r.id !== event.id) })
      },

    }),
    {
      name: 'wallet-state', // name of item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default the 'localStorage' is used
      partialize: state => ({ secret: state.secret, receivedJWTs: state.receivedJWTs }),
    },
  ),
);

