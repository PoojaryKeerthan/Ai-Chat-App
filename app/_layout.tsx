// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "../global.css"
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import Constants from 'expo-constants';
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'spaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
    'AlataRegular': require('../assets/fonts/Alata-Regular.ttf'),
    'KumbhSans': require('../assets/fonts/KumbhSans-VariableFont_YOPQ,wght.ttf'),
  });
  return (
    <>
    <View className="flex-1 bg-yellow-300">
    <StatusBar style="dark"/>
     <View style={{ height: Constants.statusBarHeight, backgroundColor: '#fde047' }} />
      <Stack
        screenOptions={{
          animation: 'fade',
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent', // so bg-yellow-300 is visible
          },
        }}
      />
    </View>
    </>
  );
}
