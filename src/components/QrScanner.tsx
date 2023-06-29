import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeEvent, BarCodeScanner, PermissionStatus } from 'expo-barcode-scanner';

interface Props {
  onScan: (data: string) => void;
}

export default function QrScanner(props: Props) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === PermissionStatus.GRANTED);
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = (barcode: BarCodeEvent) => {
    setScanned(true);
    // alert(`Bar code with type ${barcode.type} and data ${barcode.data} has been scanned!`);
    if (barcode.type === 'org.iso.QRCode') {
      console.log("Scanned QRcode")
      if (barcode.data.includes("wc:")) {
        console.log("Scanned WalletConnect QRcode")
        props.onScan(barcode.data)
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
