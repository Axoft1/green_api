import React from 'react';
import './ChatList.scss';

interface ChatListProps {
    chats: { phoneNumber: string }[];
    activeChat: string | null;
    onSelectChat: (phoneNumber: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChat, onSelectChat }) => {
    return (
        <div className="chat-list">
            {chats.map((chat) => (
                <button
                    key={chat.phoneNumber}
                    className={`chat-button ${activeChat === chat.phoneNumber ? 'active' : ''}`}
                    onClick={() => onSelectChat(chat.phoneNumber)}
                >
                    {chat.phoneNumber}
                </button>
            ))}
        </div>
    );
};

export default ChatList;