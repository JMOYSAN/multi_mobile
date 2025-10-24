import React, { useRef } from 'react'
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native'

import ChatInput from '../components/messages/ChatInput'
import MessageBubble from '../components/messages/MessageBubble'
import MessageBubbleOther from '../components/messages/MessageBubbleOther'
import TopBar from '../components/Topbar'
import { useMessages } from '../hooks/useMessages'

export default function ChatScreen({ route, navigation }) {
    const { currentUser, currentGroupe } = route.params
    const flatListRef = useRef(null)

    // --- Hook: handles REST + WS sync ---
    const {
        messages,
        members,
        send,
        loadMoreMessages,
        hasMore,
        pending,
    } = useMessages(currentGroupe, currentUser)

    const log = (...args) => console.log('[ChatScreen]', ...args)

    // --- Send message ---
    const handleSend = async (contenu) => {
        if (!contenu?.message?.trim()) return
        log('📤 Sending →', contenu.message)
        await send(contenu)
        if (flatListRef.current)
            flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }

    const renderItem = ({ item }) => {
        const mine = item.user_id === currentUser.id
        return mine ? (
            <MessageBubble message={item} />
        ) : (
            <MessageBubbleOther
                message={{
                    ...item,
                    username: members[item.user_id] || 'Inconnu',
                }}
            />
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                {/* Top bar */}
                <TopBar
                    currentGroupe={currentGroupe}
                    currentUser={currentUser}
                    participants={Object.keys(members).map((id) => ({
                        id,
                        username: members[id],
                    }))}
                    navigation={navigation}
                    onClose={() => navigation.goBack()}
                />

                {/* Messages list */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    inverted
                    keyExtractor={(item, index) => `${item.id || 'tmp'}-${index}`}
                    contentContainerStyle={styles.messagesContainer}
                    onEndReached={() => hasMore && loadMoreMessages()}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        pending ? (
                            <Text style={styles.loadingText}>Chargement...</Text>
                        ) : null
                    }
                    renderItem={renderItem}
                />

                {/* Input zone */}
                <View style={styles.inputContainer}>
                    <ChatInput onSend={handleSend} disabled={pending} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    messagesContainer: { padding: 10, flexGrow: 1 },
    loadingText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: '#999',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f9f9f9',
        paddingBottom: Platform.OS === 'ios' ? 10 : 5,
    },
})
