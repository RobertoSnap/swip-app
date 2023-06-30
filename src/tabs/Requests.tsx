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




export default function Requests() {
    const { requests: request, receivedJWTs, approveRequest, declineRequest, decodeJWT, acceptJWT } = useWallet()
    const [decoded, setDecoded] = React.useState<JWTDecodedWithCredentialType>()
    const navigation = useNavigation<BottomTabNavigationProp<TabNavigationParams>>();



    const renderItem = (item: typeof request[0]) => {
        if (item.params.request.method === "present_credential") {
            const credentialType = item.params.request.params[0] as string
            if (typeof credentialType !== "string") {
                return <Text>Invalid credential type requested</Text>
            }
            if (receivedJWTs.length === 0) {
                return <Text>No credentials to pressent.</Text>
            }
            const presentableCredetial = receivedJWTs.map((jwt) => ({ jwt, decoded: decodeJWT(jwt) })).filter(Boolean).find(jwtAndDecoded => jwtAndDecoded.decoded?.payload.employmentoffer)
            if (!presentableCredetial) {
                return <Text>No credentials to present.</Text>
            }
            return (
                <View>
                    <Text style={{ marginBottom: 10 }}>{`Do you want to present ${credentialType}?`}</Text>
                    <EmploymentOfferCard data={presentableCredetial.decoded.payload.employmentoffer}></EmploymentOfferCard>
                    <Button color={"green"} title='Accept' onPress={() => approveRequest(item, { result: presentableCredetial.jwt })}></Button>
                    <Button color={"red"} title='Decline' onPress={() => declineRequest(item, "Declined by user", {})}></Button>
                </View >
            )
        }
        if (item.params.request.method === "receive_credential") {
            const jwt = item.params.request.params[0] as string
            if (typeof jwt !== "string") {
                return <Text>Invalid credential, jwt must be string</Text>
            }
            const decoded = decodeJWT(jwt)
            if (!decoded) {
                return <Text>Could not decode credential</Text>
            }
            return (
                <View>
                    <Text style={{ marginBottom: 10 }}>{`Do you want to save ${decoded.payload.employmentoffer ? "employment offer" : "unknown"}?`}</Text>
                    <EmploymentOfferCard data={decoded.payload.employmentoffer}></EmploymentOfferCard>
                    <Button color={"green"} title='Accept' onPress={() => {
                        acceptJWT(jwt)
                        approveRequest(item, { result: true })
                    }}></Button>
                    <Button color={"red"} title='Decline' onPress={() => declineRequest(item, "Declined by user", {})}></Button>
                </View >
            )
        }
        return <Text>Invalid request</Text>

    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar style="auto" />
            <FlatList
                data={request}
                renderItem={(item) => renderItem(item.item)}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => <Text>No credentials</Text>}
            />
        </View>
    );
}