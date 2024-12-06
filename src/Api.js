const API_URL = "http://localhost:8080/api";

// Регистрация пользователя
export async function signUp(username, fullName, password, role) {
    const response = await fetch(`${API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, fullName, password, role }),
    });

    if (!response.ok) {
        throw new Error("Ошибка регистрации: данное имя пользователя занято");
    }

    return response.json(); // Возвращает объект с токеном
}

// Авторизация пользователя
export async function signIn(username, password) {
    const authResponse = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!authResponse.ok) {
        throw new Error("Ошибка авторизации: неверное имя пользователя или пароль");
    }

    const { token } = await authResponse.json();
    return { token };
}

export async function getUserByUsername(username, token) {
    const userResponse = await fetch(`${API_URL}/users/username/${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!userResponse.ok) {
        throw new Error("Не удалось получить данные пользователя");
    }

    return await userResponse.json();
}

// Получение списка пользователей
export async function getUsers() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Не удалось получить список пользователей");
    }

    return response.json();
}

// Получение списка бронирований по пользователям
export async function getCustomerBookings() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/customer-bookings`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Не удалось получить данные о бронированиях");
    }

    return response.json();
}

// Получение пилотов
export async function getPilots() {
    const response = await fetch(`${API_URL}/bookings/pilots`);
    if (!response.ok) {
        throw new Error("Не удалось получить список пилотов");
    }
    return response.json();
}

// Получение маршрутов
export async function getRoutes() {
    const response = await fetch(`${API_URL}/bookings/routes`);
    if (!response.ok) {
        throw new Error("Не удалось получить список маршрутов");
    }
    return response.json();
}

// Получение шаров
export async function getBalloons() {
    const response = await fetch(`${API_URL}/bookings/balloons`);
    if (!response.ok) {
        throw new Error("Не удалось получить список шаров");
    }
    return response.json();
}

// Создание бронирования
export const createBooking = async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
        // Попробуем разобрать JSON с ошибкой, если он есть
        const errorData = await response.json().catch(() => null);
        if (errorData && errorData.error) {
            throw new Error(errorData.error); // Пробрасываем сообщение из ответа
        }
        throw new Error("Ошибка сети или сервера. Проверьте соединение."); // Общая ошибка
    }

    return response.json(); // Возвращаем успешный ответ
};



export async function getCustomer(userId) {
    const response = await fetch(`${API_URL}/customers/${userId}`);
    if (!response.ok) {
        throw new Error("Не удалось получить данные о клиенте");
    }
    return response.json();
}
