import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import ChatInput from '../components/messages/ChatInput';
import MessageBubble from '../components/messages/MessageBubble';
import MessageBubbleOther from '../components/messages/MessageBubbleOther';
import TypingIndicator from '../components/messages/TypingIndicator';
import TopBar from '../components/Topbar';
import {
    fetchMessages,
    fetchOlderMessages,
    sendMessage,
} from '../services/messageService.js';
import { fetchWithAuth } from '../services/authService.js';
import { API_URL } from '@env';

export default function ChatScreen({ route, navigation }) {
    const { currentUser, currentGroupe } = route.params;
    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [pending, setPending] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const flatListRef = useRef(null);

    const log = (...args) => console.log('[ChatScreen]', ...args);

    // ---- Fetch participants ----
    const loadParticipants = async () => {
        if (!currentGroupe?.id) return;
        const url = `${API_URL}/groups-users/group/${currentGroupe.id}`;
        try {
            const res = await fetchWithAuth(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setParticipants(data || []);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement participants:', err);
            setParticipants([]);
        }
    };

    // ---- Fetch messages ----
    const loadMessages = async () => {
        if (!currentGroupe?.id) return;
        try {
            setPending(true);
            const data = await fetchMessages(currentGroupe.id);
            setMessages(data || []);
            setHasMore(data?.length >= 20);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement messages:', err);
        } finally {
            setPending(false);
        }
    };

    // ---- Lazy load older messages ----
    const loadMoreMessages = async () => {
        if (!hasMore || pending || messages.length === 0) return;
        const firstId = messages[messages.length - 1].id; // oldest because list is inverted
        try {
            setPending(true);
            const older = await fetchOlderMessages(currentGroupe.id, firstId);
            if (!older || older.length === 0) setHasMore(false);
            else setMessages((prev) => [...prev, ...older]);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement anciens messages:', err);
        } finally {
            setPending(false);
        }
    };

    // ---- Send message ----
    const handleSend = async (contenu) => {
        if (!contenu?.message?.trim() || !currentUser || !currentGroupe) return;
        const userId = currentUser.id;
        const groupId = currentGroupe.id;
        const content = contenu.message;

        try {
            log('🚀 Sending message →', { userId, groupId, content });
            const msg = await sendMessage(userId, groupId, content);

            // Prepend for inverted list
            setMessages((prev) => [msg, ...prev]);

            if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
        } catch (err) {
            console.error('[ChatScreen] Erreur envoi message:', err);
        }
    };

    // ---- Load on group change ----
    useEffect(() => {
        loadMessages();
        loadParticipants();
    }, [currentGroupe]);

    // ---- Merge usernames ----
    useEffect(() => {
        if (participants.length && messages.length) {
            const merged = messages.map((m) => {
                const p = participants.find((p) => p.id === m.user_id);
                return {
                    ...m,
                    username: p
                        ? p.username
                        : m.user_id === currentUser.id
                            ? currentUser.nom || 'Moi'
                            : 'Inconnu',
                };
            });
            setMessages(merged);
        }
    }, [participants]);

    const participantsTyping =
        participants.filter(
            (p) => p.isTyping && p.username !== currentUser?.username
        ) || [];

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <TopBar
                    currentGroupe={currentGroupe}
                    currentUser={currentUser}
                    participants={participants}
                    navigation={navigation}
                    onClose={() => navigation.goBack()}
                />

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    inverted
                    keyExtractor={(item, index) => `${item.id || 'tmp'}-${index}`}
                    contentContainerStyle={styles.messagesContainer}
                    onEndReached={loadMoreMessages}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        pending ? (
                            <Text style={styles.loadingText}>Chargement...</Text>
                        ) : null
                    }
                    renderItem={({ item }) => {
                        const mine = item.user_id === currentUser.id;
                        return mine ? (
                            <MessageBubble message={item} />
                        ) : (
                            <MessageBubbleOther message={item} />
                        );
                    }}
                />

                {participantsTyping.length > 0 && (
                    <View style={styles.typingContainer}>
                        {participantsTyping.map((p) => (
                            <TypingIndicator key={p.id} nom={p.username} />
                        ))}
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <ChatInput onSend={handleSend} disabled={pending} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    messagesContainer: { padding: 10, flexGrow: 1 },
    typingContainer: { paddingHorizontal: 10, paddingBottom: 5 },
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
});
