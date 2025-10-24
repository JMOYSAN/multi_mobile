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

    console.log('[ChatScreen] Loaded with:', currentUser, currentGroupe);

    const [messages, setMessages] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [pending, setPending] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const flatListRef = useRef(null);

    const log = (...args) => console.log('[ChatScreen]', ...args);

    // ✅ Fixed endpoint
    const loadParticipants = async () => {
        if (!currentGroupe?.id) {
            log('No currentGroupe.id → skipping participant load');
            return;
        }
        const url = `${API_URL}/groups-users/group/${currentGroupe.id}`;


        log('Fetching participants from:', url);
        try {
            const res = await fetchWithAuth(url);
            log('Participants response status:', res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            log('Participants data:', data);
            setParticipants(data || []);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement participants:', err);
            setParticipants([]);
        }
    };

    const loadMessages = async () => {
        if (!currentGroupe?.id) {
            log('No currentGroupe.id → skipping message load');
            return;
        }
        log('Loading messages for group:', currentGroupe.id);
        try {
            setPending(true);
            const data = await fetchMessages(currentGroupe.id);
            log('Messages fetched:', data?.length, 'items');
            setMessages(data || []);
            setHasMore(data?.length >= 20);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement messages:', err);
        } finally {
            setPending(false);
        }
    };

    const loadMoreMessages = async () => {
        if (!hasMore || pending || messages.length === 0) {
            log(
                'Skip loadMoreMessages → hasMore:',
                hasMore,
                'pending:',
                pending,
                'len:',
                messages.length
            );
            return;
        }
        const firstId = messages[0].id;
        log('Loading older messages before id:', firstId);
        try {
            setPending(true);
            const older = await fetchOlderMessages(currentGroupe.id, firstId);
            log('Older messages fetched:', older?.length);
            if (!older || older.length === 0) setHasMore(false);
            else setMessages((prev) => [...older, ...prev]);
        } catch (err) {
            console.error('[ChatScreen] Erreur chargement anciens messages:', err);
        } finally {
            setPending(false);
        }
    };

    const handleSend = async (contenu) => {
        log('handleSend called with contenu:', contenu);
        if (!contenu?.message?.trim() || !currentUser || !currentGroupe) {
            log('Send skipped → invalid params');
            return;
        }
        const userId = currentUser.id;
        const groupId = currentGroupe.id;
        const content = contenu.message;
        try {
            log('Sending message →', { userId, groupId, content });
            const msg = await sendMessage(userId, groupId, content);
            log('Send response:', msg);
            setMessages((prev) => [...prev, msg]);
            if (flatListRef.current)
                flatListRef.current.scrollToEnd({ animated: true });
        } catch (err) {
            console.error('[ChatScreen] Erreur envoi message:', err);
        }
    };

    useEffect(() => {
        log('useEffect → currentGroupe changed:', currentGroupe);
        loadMessages();
        loadParticipants();
    }, [currentGroupe]);

    useEffect(() => {
        log('Messages updated → count:', messages.length);
    }, [messages]);

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
                    participants={participants}
                    onClose={() => navigation.goBack()}
                />

                <Text style={styles.participants}>
                    Participants: {participants.length}
                </Text>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.messagesContainer}
                    onEndReached={loadMoreMessages}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={
                        pending ? (
                            <Text style={styles.loadingText}>Chargement...</Text>
                        ) : null
                    }
                    renderItem={({ item }) => {
                        log('Render message id:', item.id);
                        return item.user_id === currentUser.id ? (
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
    messagesContainer: { padding: 10, flexGrow: 1, justifyContent: 'flex-end' },
    typingContainer: { paddingHorizontal: 10, paddingBottom: 5 },
    loadingText: {
        textAlign: 'center',
        paddingVertical: 10,
        color: '#999',
    },
    participants: {
        textAlign: 'center',
        color: '#333',
        fontSize: 14,
        marginVertical: 5,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#f9f9f9',
        paddingBottom: Platform.OS === 'ios' ? 10 : 5,
    },
});
