import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import createGreenApiService from '../../services/greenApiService';
import './LoginPage.scss';

interface LoginFormInputs {
    idInstance: string;
    apiTokenInstance: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError: setFormError,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data: LoginFormInputs) => {
        const { idInstance, apiTokenInstance } = data;

        try {
            const greenApiService = createGreenApiService({ idInstance, apiTokenInstance });

            await greenApiService.checkAuth();

            localStorage.setItem('idInstance', idInstance);
            localStorage.setItem('apiTokenInstance', apiTokenInstance);
            navigate('/chat');
        } catch (error: any) {
            setFormError('root', {
                type: 'manual',
                message: 'Неверные учетные данные. Проверьте idInstance и apiTokenInstance.',
            });
        }
    };

    return (
        <div className="login-page">
            <h1>Вход в GREEN-API</h1>
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="idInstance"
                        {...register('idInstance', { required: 'Это поле обязательно для заполнения' })}
                    />
                    {errors.idInstance && (
                        <span className="error-message">{errors.idInstance.message}</span>
                    )}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="apiTokenInstance"
                        {...register('apiTokenInstance', { required: 'Это поле обязательно для заполнения' })}
                    />
                    {errors.apiTokenInstance && (
                        <span className="error-message">{errors.apiTokenInstance.message}</span>
                    )}
                </div>
                {errors.root && (
                    <div className="error-message">{errors.root.message}</div>
                )}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
};

export default LoginPage;