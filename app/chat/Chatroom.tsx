import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getGeminiResponse } from '../../utils/ApiFetch'; // Adjust the path if needed

export default function Chatroom() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
    // Add some dummy messages to test scrolling
    {
      id: '2',
      text: 'This is a test message to check scrolling functionality.',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'Another message to make the list longer so we can test if scrolling works properly when keyboard is not visible.',
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: '4',
      text: 'Yet another message for testing.',
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: '5',
      text: 'More content to ensure we have enough messages to require scrolling.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.stopAnimation();
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 50);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Scroll after state update
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      const replyText = await getGeminiResponse(inputText);
      const botReply = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botReply]);
      // Scroll after bot reply is added
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        text: "⚠️ Error getting response.",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      // Scroll after error message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } finally {
      setIsTyping(false);
      // Final scroll to bottom after typing indicator is removed
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const TypingIndicator = () => (
    <View className="flex-row items-center px-4 py-2 m-2 bg-gray-200 rounded-xl self-start max-w-[80%]">
      <View className="w-6 h-6 bg-blue-500 rounded-full mr-2 items-center justify-center">
        <Ionicons name="logo-android" size={12} color="white" />
      </View>
      <View className="flex-row items-center">
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={{ opacity: typingAnimation }}
            className="w-2 h-2 bg-gray-500 rounded-full mr-1"
          />
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item, index }: any) => {
    const isUser = item.sender === 'user';
    const showAvatar = index === 0 || messages[index - 1]?.sender !== item.sender;

    return (
      <View className={`flex-row items-end px-4 py-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && showAvatar && (
          <View className="w-8 h-8 bg-blue-500 rounded-full mr-2 items-center justify-center mb-1">
            <Ionicons name="logo-android" size={16} color="white" />
          </View>
        )}
        {!isUser && !showAvatar && <View className="w-8 mr-2" />}
        <View className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
          <View
            className={`px-4 py-3 rounded-2xl ${
              isUser ? 'bg-blue-500 rounded-br-md' : 'bg-gray-200 rounded-bl-md'
            }`}
          >
            <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}>
              {item.text}
            </Text>
          </View>
          <Text className="text-xs text-gray-500 mt-1 px-1">
            {formatTime(item.timestamp)}
          </Text>
        </View>
        {isUser && showAvatar && (
          <View className="w-8 h-8 bg-green-500 rounded-full ml-2 items-center justify-center mb-1">
            <Ionicons name="person" size={16} color="white" />
          </View>
        )}
        {isUser && !showAvatar && <View className="w-8 ml-2" />}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="logo-android" size={24} color="white" />
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-900">AI Assistant</Text>
              <Text className="text-sm text-green-500">● Online</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1">
          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              paddingVertical: 16,
              paddingBottom: keyboardHeight + 90
            }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
            onContentSizeChange={() => {
              // Scroll when content size changes (new messages added)
              setTimeout(() => {
                scrollToBottom();
              }, 50);
            }}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />

          {/* Input Container */}
          <View
            className="bg-white border-t border-gray-200 px-4 py-3 absolute bottom-0 left-0 right-0"
            style={{ 
              bottom: keyboardHeight,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <TouchableWithoutFeedback>
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <TextInput
                  ref={inputRef}
                  className="flex-1 text-base text-gray-800 py-2 px-2"
                  placeholder="Type a message..."
                  placeholderTextColor="#9CA3AF"
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  multiline={true}
                  maxLength={1000}
                  style={{ 
                    maxHeight: 100,
                    minHeight: 40 
                  }}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollToBottom();
                    }, 300);
                  }}
                />
                <TouchableOpacity
                  onPress={sendMessage}
                  className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                    inputText.trim() ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  disabled={!inputText.trim()}
                >
                  <Ionicons name="send" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}