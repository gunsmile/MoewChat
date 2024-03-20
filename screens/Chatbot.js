import React, { useState} from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import {speak, isSpeakingAsync,stop} from "expo-speech";
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS} from '../constants'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import { useTheme } from '../themes/ThemeProvider'
import { FONTS, SIZES, images } from '../constants'

const Chatbot = ({navigation}) => {
    const [chat, setChat] = useState([]);
    const [useInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "AIzaSyBhmlZS0lUa7Pl8JaJq5vSULp4pwFYUh3c";

    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{text: useInput}],
            },
        ];
    
        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat,
                }
            );            

        console.log("Gemini Pro API Response:", response.data);

        const modelResponse =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        if (modelResponse) {
            const updatedChatWithModel = [
                ...updatedChat,
                {
                    role: "model",
                    parts: [{text: modelResponse}],
                },
            ];

            setChat(updatedChatWithModel);
            setUserInput(""); 
            }
        } 
        catch(error) {
            console.error("Error calling Gemini Pro API:",error);
            console.error("Error response:" ,error.response);
            setError("An error occurred. please try again.");
        } 
        finally {
            setLoading(false);
        }
    };
    
    const handleSpeech = async (text) => {
        if (isSpeaking){
            stop();
            setIsSpeaking(false);
        }
        else {
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({item}) => (
        <ChatBubble
        role = {item.role}
        text = {item.parts[0].text}
        onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    return (
        <View style={styles.container}>
             <View style={styles.head}>
               <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.text}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>MoewChat</Text>
                <TouchableOpacity onPress={() => console.log('Save chat')}style={{
                        height: 40,
                        width: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    
                    <Ionicons
                        name="bookmark-outline"
                        size={24}
                        color={COLORS.text}
                    />
                </TouchableOpacity>
                </View>
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor={COLORS.text}
                    value={useInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                <Ionicons style={styles.buttonText}
                        name="navigate"
                        size={20}
                        color={COLORS.text}
                    />
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    head:{
        flexDirection: "row",
        justifyContent: "space-between"
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.bg,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.primary,
        textAlign: "center",
        paddingTop:6
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    input: {
        ...FONTS.body4,
        flex: 1,
        paddingHorizontal: 10,
        borderColor:COLORS.primary,
        borderWidth:2,
        borderRadius: 15,
        padding:3
    },
    button: {
        padding: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        marginStart:5
    },
    buttonText: {
        color: COLORS.white,
        justifyContent:"center",
        alignItems:"center",
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
});

export default Chatbot;

    