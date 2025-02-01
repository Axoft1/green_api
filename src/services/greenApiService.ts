// src/services/greenApiService.ts
import axios from 'axios';
import { handleApiError } from './errorHandler';

const BASE_URL = 'https://api.green-api.com';

interface GreenApiConfig {
    idInstance: string;
    apiTokenInstance: string;
}

interface GetChatHistoryPayload {
    chatId: string;
    count: number;
}

const createGreenApiService = ({ idInstance, apiTokenInstance }: GreenApiConfig) => {
    const api = axios.create({
        baseURL: `${BASE_URL}/waInstance${idInstance}`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return {
        /**
         * Проверка авторизации (получение настроек аккаунта)
         */
        checkAuth: async () => {
            try {
                const response = await api.get(`/getSettings/${apiTokenInstance}`);
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при проверке авторизации:', apiError.message);
                throw apiError;
            }
        },

        /**
         * Отправка текстового сообщения
         * @param chatId - ID чата (номер телефона получателя в формате XXXXXXXXXX@c.us)
         * @param message - Текст сообщения
         */
        sendMessage: async (chatId: string, message: string) => {
            try {
                const response = await api.post(`/SendMessage/${apiTokenInstance}`, {
                    chatId,
                    message,
                });
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при отправке сообщения:', apiError.message);
                throw apiError;
            }
        },

        /**
         * Получение входящих уведомлений (сообщений)
         */
        receiveNotification: async () => {
            try {
                const response = await api.get(`/receiveNotification/${apiTokenInstance}`);
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при получении уведомлений:', apiError.message);
                throw apiError;
            }
        },

        /**
         * Получение сообщения по его ID
         * @param idMessage - ID сообщения
         */
        getMessage: async (idMessage: string) => {
            try {
                const response = await api.get(`/getMessage/${apiTokenInstance}/${idMessage}`);
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при получении сообщения:', apiError.message);
                throw apiError;
            }
        },

        /**
         * Получение истории чата
         * @param payload - Объект с параметрами: chatId и count
         */
        getChatHistory: async (payload: GetChatHistoryPayload) => {
            try {
                const response = await api.post(`/getChatHistory/${apiTokenInstance}`, payload);
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при получении истории чата:', apiError.message);
                throw apiError;
            }
        },

        /**
         * Удаление уведомления после обработки
         * @param receiptId - ID уведомления
         */
        deleteNotification: async (receiptId: number) => {
            try {
                const response = await api.delete(`/DeleteNotification/${apiTokenInstance}/${receiptId}`);
                return response.data;
            } catch (error) {
                const apiError = handleApiError(error);
                console.error('Ошибка при удалении уведомления:', apiError.message);
                throw apiError;
            }
        },
    };
};

export default createGreenApiService;