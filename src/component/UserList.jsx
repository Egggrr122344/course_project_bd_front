// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getUsers();
                setUsers(userList);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Список пользователей</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.userId}>
                        <p><strong>Имя пользователя:</strong> {user.username}</p>
                        <p><strong>Роль:</strong> {user.role}</p>
                        <p><strong>Статусы аккаунта:</strong></p>
                        <ul>
                            <li>Аккаунт не просрочен: {user.accountNonExpired ? "Да" : "Нет"}</li>
                            <li>Аккаунт активирован: {user.enabled ? "Да" : "Нет"}</li>
                            <li>Аккаунт не заблокирован: {user.accountNonLocked ? "Да" : "Нет"}</li>
                            <li>Учетные данные не просрочены: {user.credentialsNonExpired ? "Да" : "Нет"}</li>
                        </ul>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
