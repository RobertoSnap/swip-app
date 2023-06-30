import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as didJWT from 'did-jwt';
import { useWallet } from '../state/useWallet';
import { JWTDecodedWithCredentialType } from '../utils/credential-types';
import EmploymentOfferCard from '../components/EmploymentOfferCard';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabNavigationParams } from '../screens/Home';




export default function Credentials() {
    const { receivedJWTs, decodeJWT } = useWallet()
    const [decoded, setDecoded] = React.useState<JWTDecodedWithCredentialType[]>([])


    useEffect(() => {
        let subscribed = true
        const doAsync = async () => {
            const decoded = receivedJWTs.map((jwt) => {
                return decodeJWT(jwt)
            }).filter(Boolean)
            if (subscribed) {
                setDecoded(decoded)
            }
        };
        doAsync();
        return () => { subscribed = false }
    }, [receivedJWTs])

    const renderItem = (item: JWTDecodedWithCredentialType) => (
        <View style={{ padding: 15, borderBottomWidth: 3, borderBottomColor: '#ccc', borderTopWidth: 3 }}>
            {Object.entries(item.payload).map(([key, value]) => (
                <Text key={key}>{`${key}: ${JSON.stringify(value, null, 2)}`}</Text>
            ))}
            <Text>{`${item.payload}: ${item.payload.employmentoffer.jobenddate}`}</Text>
        </View>
    );



    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar style="auto" />
            <FlatList
                data={decoded}
                renderItem={(item) => renderItem(item.item)}
                keyExtractor={(item) => item.signature}
                ListEmptyComponent={() => <Text>No credentials</Text>}
            />
        </View>
    );
}