import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Settings() {

    useEffect(() => {
        console.log('Settings')
    }, [])


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar style="auto" />
            <Text>Settings</Text>
            <Button onPress={() => AsyncStorage.clear()} title='Clear async storage'></Button>
        </View>
    );
}