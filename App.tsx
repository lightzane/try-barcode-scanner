import type { BarcodeScanningResult } from 'expo-camera/next';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      setScanned(false);
    });

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (scanned) {
      return; // prevent infinite scan
    }

    setScanned(true);

    Alert.alert('Result', `${type}\n${data}`, [
      { text: 'Close' },
      {
        text: 'Copy value',
        onPress: async () => {
          await Clipboard.setStringAsync(data);
          alert('Copied!');
        },
      },
    ]);
  };

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 25, fontWeight: '500' }}>
          No access to camera
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}>
        {scanned && (
          <GestureDetector gesture={doubleTap}>
            <View style={styles.container}>
              <Pressable style={styles.button}>
                <Text style={styles.text}>
                  Double Tap anywhere to Scan Again
                </Text>
              </Pressable>
            </View>
          </GestureDetector>
        )}
      </CameraView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#282a36',
    padding: 15,
  },
  text: {
    color: '#fff',
  },
});
