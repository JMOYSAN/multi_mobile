import React, { useEffect, useRef } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';

import ChatInput from '../components/messages/ChatInput';
import MessageBubble from '../components/messages/MessageBubble';
import MessageBubbleOther from '../components/messages/MessageBubbleOther';
import TypingIndicator from '../components/messages/TypingIndicator';
import TopBar from '../components/messages/TopBar';

import { useMessages } from '../hooks/useMessages';

const ChatScreen = ({
                        currentUser,
                        setCurrentUser,
                        currentGroupe,
                        utilisateurs,
                        onClose,
                        setCurrentGroupe,
                        setGroupes,
                    }) => {
    const flatListRef = useRef(null);
    const {
        messages,
        loadMoreMessages,
        hasMore,
        pending,
        members,
        refresh,
    } = useMessages(currentGroupe, currentUser);


    useEffect(() => {
        if (!pending && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = async (contenu) => {
        if (!currentUser || !currentGroupe || !contenu?.message?.trim()) return;

        try {
            const res = await fetch('http://10.13.0.13:3000/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUser.id,
                    group_id: currentGroupe.id,
                    content: contenu.message,
                }),
            });
            if (!res.ok) throw new Error('Erreur envoi message');
            await res.json();
        } catch (err) {
            console.error('Erreur envoi message:', err);
        }
    };

    const handleLoadMore = async () => {
        if (hasMore && !pending && messages.length > 0) {
            const firstId = messages[0]?.id;
            await loadMoreMessages(firstId);
        }
    };

    const participantsTyping =
        currentGroupe?.participants?.filter(
            (p) => p.isTyping && p.nom !== currentUser?.username
        ) || [];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <TopBar
                utilisateurs={utilisateurs}
                currentGroupe={currentGroupe}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onClose={onClose}
                setCurrentGroupe={setCurrentGroupe}
                setGroupes={setGroupes}
            />

            <FlatList
                ref={flatListRef}
                data={[...messages].reverse()}
                inverted
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesContainer}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.2}
                ListFooterComponent={
                    pending && messages.length > 0 ? (
                        <Text style={styles.loadingText}>Chargement...</Text>
                    ) : null
                }
                renderItem={({ item }) =>
                    item.user_id === currentUser.id ? (
                        <MessageBubble message={item} members={members} />
                    ) : (
                        <MessageBubbleOther message={item} members={members} />
                    )
                }
            />

            {participantsTyping.length > 0 && (
                <View style={styles.typingContainer}>
                    {participantsTyping.map((p) => (
                        <TypingIndicator key={p.nom} nom={p.nom} />
                    ))}
                </View>
            )}

            <ChatInput onSend={handleSend} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesContainer: {
        padding: 10,
    },
    typingContainer: {
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    loadingText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: '#999',
    },
});

export default ChatScreen;
