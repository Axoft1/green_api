import React from 'react';
import './ChatWindow.scss';

interface Message {
    idMessage: string;
    text: string;
    sender: 'user' | 'recipient';
    timestamp: number;
}

interface ChatWindowProps {
    messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    return (
        <div className="chat-window">
            {messages.length > 0 ? (
                messages.map((msg) => (
                    <div key={msg.idMessage} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))
            ) : (
                <div className="no-chat-selected">Выберите чат для начала общения</div>
            )}
        </div>
    );
};

export default ChatWindow;