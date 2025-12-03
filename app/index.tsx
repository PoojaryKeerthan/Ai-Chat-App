import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import "../global.css"
import { useRouter } from 'expo-router';
const index = () => {
   const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/chat");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View className="flex-1 items-center justify-center bg-yellow-400">
      <Text className="text-2xl font-bold text-gray-800">Welcome to AI Chat App</Text>
      <Text className="text-lg text-gray-600 mt-2">Redirecting to chat...</Text>
    </View>
  )
}

export default index