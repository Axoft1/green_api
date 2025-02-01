export interface Message {
    idMessage: string;
    text: string;
    sender: 'user' | 'recipient';
    timestamp: number;
}

export interface Chat {
    phoneNumber: string;
    messages: Message[];
    isHistoryLoaded: boolean; // Новое поле
}