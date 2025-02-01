import React, { useState, useEffect } from 'react';
import createGreenApiService from '../../services/greenApiService';
import ChatList from '../../components/ChatList/ChatList';
import MessageForm from '../../components/MessageForm/MessageForm';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import './ChatPage.scss';
import { MessageFormInputs } from '../../components/MessageForm/types';
import { SubmitHandler } from 'react-hook-form';
import { Chat } from './types';



const ChatPage: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const idInstance = localStorage.getItem('idInstance') || '';
    const apiTokenInstance = localStorage.getItem('apiTokenInstance') || '';

    const greenApiService = createGreenApiService({ idInstance, apiTokenInstance });

    const handleSendMessage: SubmitHandler<MessageFormInputs> = async (data: MessageFormInputs) => {
        const { recipientNumber, message } = data;

        try {
            const chatId = `${recipientNumber}@c.us`;
            const response = await greenApiService.sendMessage(chatId, message);
            const idMessage = response.idMessage;

            const existingChat = chats.find((chat) => chat.phoneNumber === recipientNumber);

            // Если чат с таким номером еще не существует, создаем новый чат
            if (!existingChat) {
                const newChat: Chat = {
                    phoneNumber: recipientNumber,
                    messages: [
                        {
                            idMessage,
                            text: message,
                            sender: 'user',
                            timestamp: Date.now(),
                        },
                    ],
                    isHistoryLoaded: false,
                };

                setChats((prevChats) => [...prevChats, newChat]);

                await loadChatHistory(recipientNumber);
            } else {
                // Если чат уже существует, просто добавляем новое сообщение
                const updatedChats: Chat[] = chats.map((chat) =>
                    chat.phoneNumber === recipientNumber
                        ? {
                            ...chat,
                            messages: [
                                ...chat.messages,
                                {
                                    idMessage,
                                    text: message,
                                    sender: 'user',
                                    timestamp: Date.now(),
                                },
                            ],
                        }
                        : chat
                );

                setChats(updatedChats);
            }

            setActiveChat(recipientNumber);
            setError(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Получение входящих сообщений
    const fetchIncomingMessages = async () => {
        try {
            const notification = await greenApiService.receiveNotification();
            if (notification) {
                const idMessage = notification.body.idMessage;

                const messageData = await greenApiService.getMessage(idMessage);

                if (messageData.typeMessage === 'textMessage' || messageData.typeMessage === 'extendedTextMessage') {
                    const text = messageData.textMessage || messageData.extendedTextMessage?.text;
                    const chatId = messageData.chatId.replace('@c.us', ''); // Убираем суффикс @c.us

                    if (text) {
                        const updatedChats: Chat[] = chats.map((chat) =>
                            chat.phoneNumber === chatId
                                ? {
                                    ...chat,
                                    messages: [
                                        ...chat.messages,
                                        {
                                            idMessage: messageData.idMessage,
                                            text,
                                            sender: 'recipient',
                                            timestamp: messageData.timestamp,
                                        },
                                    ],
                                }
                                : chat
                        );

                        // Если чат с таким номером еще не существует, создаем новый чат
                        if (!updatedChats.some((chat) => chat.phoneNumber === chatId)) {
                            updatedChats.push({
                                phoneNumber: chatId,
                                messages: [
                                    {
                                        idMessage: messageData.idMessage,
                                        text,
                                        sender: 'recipient',
                                        timestamp: messageData.timestamp,
                                    },
                                ],
                                isHistoryLoaded: false,
                            });
                        }

                        setChats(updatedChats);
                    }
                }

                await greenApiService.deleteNotification(notification.receiptId);
            }
            setError(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Загрузка истории чата при выборе чата
    const loadChatHistory = async (phoneNumber: string) => {
        try {
            const chat = chats.find((chat) => chat.phoneNumber === phoneNumber);

            if (chat && chat.isHistoryLoaded) {
                return;
            }

            const chatId = `${phoneNumber}@c.us`;
            const payload = {
                chatId,
                count: 10,
            };
            const history = await greenApiService.getChatHistory(payload);

            const messages = history.map((msg: any) => ({
                idMessage: msg.idMessage,
                text: msg.textMessage || msg.extendedTextMessage?.text,
                sender: msg.type === 'outgoing' ? 'user' : 'recipient',
                timestamp: msg.timestamp,
            }));

            const updatedChats = chats.map((chat) =>
                chat.phoneNumber === phoneNumber
                    ? {
                        ...chat,
                        messages: [...messages, ...chat.messages],
                        isHistoryLoaded: true,
                    }
                    : chat
            );

            // Если чат с таким номером еще не существует, создаем новый чат
            if (!updatedChats.some((chat) => chat.phoneNumber === phoneNumber)) {
                updatedChats.push({
                    phoneNumber,
                    messages,
                    isHistoryLoaded: true,
                });
            }

            setChats(updatedChats);
        } catch (error: any) {
            setError(error.message);
        }
    };

    // При выборе чата загружаем его историю
    const handleSelectChat = (phoneNumber: string) => {
        setActiveChat(phoneNumber);

        const chat = chats.find((chat) => chat.phoneNumber === phoneNumber);
        if (!chat || !chat.isHistoryLoaded) {
            loadChatHistory(phoneNumber);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchIncomingMessages, 5000);
        return () => clearInterval(interval);
    }, [chats]);

    const activeChatData = chats.find((chat) => chat.phoneNumber === activeChat);

    return (
        <div className="chat-page">
            <h1>Чат WhatsApp</h1>
            {error && <div className="error-message">{error}</div>}

            <ChatList chats={chats} activeChat={activeChat} onSelectChat={handleSelectChat} />

            <MessageForm activeChat={activeChat} onSubmit={handleSendMessage} />

            <ChatWindow messages={activeChatData ? activeChatData.messages : []} />
        </div>
    );
};

export default ChatPage;