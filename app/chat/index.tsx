import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function ChatHome() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-yellow-400">
      <Text className="font-AlataRegular text-6xl text-black">Hello!!</Text>
      <Text className="text-xl text-gray-800 font-KumbhSans">
        Welcome to AI Chat App
      </Text>
      <Image
        className="mt-6"
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/12205/12205168.png' }}
        style={{ width: 100, height: 100 }}
        resizeMode="contain"
      />
      <TouchableOpacity 
      onPress={() => router.push("/chat/Chatroom")}
      className="bg-green-600 px-6 py-3 rounded-full mt-6 active:opacity-50">
        <Text className="text-black text-lg font-KumbhSans">Enter Chat</Text>
      </TouchableOpacity>
    </View>
  );
}
