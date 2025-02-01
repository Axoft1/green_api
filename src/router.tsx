import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import ChatPage from './pages/ChatPage/ChatPage';


const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;