import { useState } from "react";
const API_URL = "http://localhost:8080/api";

const BackupButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBackupDatabase = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token"); // Извлечение токена из localStorage

            const response = await fetch(`${API_URL}/backup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Добавление токена в заголовок
                },
            });

            if (response.ok) {
                alert("Бэкап базы успешно создан!");
            } else {
                const error = await response.text();
                setError(error);
                alert(`Ошибка при создании бэкапа: ${error}`);
            }
        } catch (error) {
            console.error("Ошибка при запросе на бэкап базы:", error);
            setError("Не удалось создать бэкап базы.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleBackupDatabase} disabled={isLoading}>
                {isLoading ? "Создание бэкапа..." : "Создать бэкап базы"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default BackupButton;
