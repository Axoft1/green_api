import axios from "axios";

interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

export const handleApiError = (error: any): ApiError => {
    if (axios.isAxiosError(error)) {
        // Ошибка Axios (HTTP-ошибка)
        return {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data,
        };
    } else if (error instanceof Error) {
        // Ошибка JavaScript (например, сетевые ошибки)
        return {
            message: error.message,
        };
    } else {
        // Неизвестная ошибка
        return {
            message: 'Произошла неизвестная ошибка',
        };
    }
};