import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './MessageForm.scss';
import { MessageFormInputs, MessageFormProps } from './types';



const MessageForm: React.FC<MessageFormProps> = ({ activeChat, onSubmit }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<MessageFormInputs>();

    React.useEffect(() => {
        if (activeChat) {
            setValue('recipientNumber', activeChat);
        }
    }, [activeChat, setValue]);

    return (
        <form className="message-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Номер получателя (например, 79991234567)"
                    {...register('recipientNumber', {
                        required: activeChat ? false : 'Номер получателя обязателен',
                        pattern: {
                            value: /^\d{11}$/,
                            message: 'Номер должен состоять из 11 цифр',
                        },
                    })}
                />
                {errors.recipientNumber && (
                    <span className="error-message">{errors.recipientNumber.message}</span>
                )}
            </div>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Введите сообщение"
                    {...register('message', { required: 'Сообщение обязательно' })}
                />
                {errors.message && (
                    <span className="error-message">{errors.message.message}</span>
                )}
            </div>
            <button type="submit">Отправить</button>
        </form>
    );
};

export default MessageForm;