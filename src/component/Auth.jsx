// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getUserByUsername } from "../api";

// eslint-disable-next-line react/prop-types
const Auth = ({ onAuth, setRole, setUserId }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { token } = await signIn(username, password); // Авторизация
            localStorage.setItem("token", token);

            const user = await getUserByUsername(username, token);
            console.log(user); // Временная отладка
            // Извлекаем необходимые данные из ответа
            const userId = user.userId; // Или user["userId"], если ключи динамические
            const role = user.role;    // Или user["role"], если ключи динамические

            // Сохраняем данные в локальное хранилище
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);
            console.log(localStorage.getItem("userId"));
            console.log(localStorage.getItem("role"));

            // Устанавливаем состояние приложения
            setRole(role);
            setUserId(userId);
            onAuth(true);

            navigate("/dashboard");
        } catch (error) {
            setMessage(error.message || "Произошла ошибка авторизации");
        }
    };

    return (
        <div>
            <h2>Авторизация</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Auth;
