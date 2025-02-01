import { SubmitHandler } from "react-hook-form";

export interface MessageFormInputs {
    recipientNumber: string;
    message: string;
}

export interface MessageFormProps {
    activeChat: string | null;
    onSubmit: SubmitHandler<MessageFormInputs>;
}