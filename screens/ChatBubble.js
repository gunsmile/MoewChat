import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { Ionicons } from "react-native-vector-icons/Icon";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Icon } from "react-native-vector-icons/Icon";
import { COLORS, SIZES, images } from '../constants'

const ChatBubble = ({ role,text, onSpeech}) => {
    return (
    <View
        style = {[
            styles.chatItem,
            role === "user" ? styles.userChatItem : styles.modelChatItem,
        ]}
    >
        <View style={styles.chat}>
        <Text style={styles.chatText}>{text}</Text>
        {role == "model" && (
            <TouchableOpacity onPress={onSpeech} style={styles.speakerIcon}>
                <Ionicons name="volume-high-outline" size={20} color={COLORS.white}/>
            </TouchableOpacity>
        )}
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    chatItem:{
        marginBottom: 10,
        padding: 10,
        borderRadius: 15,
        maxWidth: "75%",
        position: "relative"
    },
    userChatItem:{
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
        color: COLORS.white
    },
    modelChatItem:{
        alignSelf: "flex-start",
        backgroundColor: COLORS.chatgreen,
        color: COLORS.primary,
    },
    chatText:{
        fontSize: 16,
        color: COLORS.white,
    },
    speakerIcon: {
        alignItems:"flex-end"
    },
    chat:{
        flexDirection:"column",
    }
})

export default ChatBubble