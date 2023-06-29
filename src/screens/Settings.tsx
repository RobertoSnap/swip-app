import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';


export default function Settings() {

    useEffect(() => {
        console.log('Settings')
    }, [])


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar style="auto" />
            <Text>Settings</Text>
        </View>
    );
}