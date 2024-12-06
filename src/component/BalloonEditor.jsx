import {useEffect, useState} from "react";

const BalloonEditor = () => {
    const [balloons, setBalloons] = useState([]);
    const [newBalloon, setNewBalloon] = useState({ model: "", capacity: "", status: "in_service" });
    const url = 'http://localhost:8080/api/balloons';

    // Загружаем список шаров при монтировании компонента
    useEffect(() => {
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка загрузки шаров");
                return response.json();
            })
            .then((data) => setBalloons(data))
            .catch((error) => console.error(error));
    }, []);

    // Обновление значения поля для редактирования
    const handleEditChange = (id, field, value) => {
        setBalloons((prevBalloons) =>
            prevBalloons.map((balloon) =>
                balloon.id === id ? { ...balloon, [field]: value } : balloon
            )
        );
    };

    // Сохранение изменений шара
    const handleSave = (id) => {
        const updatedBalloon = balloons.find((balloon) => balloon.id === id);
        fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBalloon),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка обновления шара");
                alert("Шар успешно обновлен!");
            })
            .catch((error) => console.error(error));
    };

    // Удаление шара
    const handleDelete = (id) => {
        fetch(`${url}/${id}`, { method: "DELETE" })
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка удаления шара");
                setBalloons((prevBalloons) => prevBalloons.filter((b) => b.id !== id));
            })
            .catch((error) => console.error(error));
    };

    // Добавление нового шара
    const handleAdd = () => {
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBalloon),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка добавления шара");
                return response.json();
            })
            .then((data) => {
                setBalloons((prevBalloons) => [...prevBalloons, data]); // Добавляем шар с id
                setNewBalloon({ model: "", capacity: "", status: "in_service" }); // Очистка формы
            })
            .catch((error) => console.error(error));
    };

    return (
        <div>
            <h2>Редактирование шаров</h2>
            <div>
                {balloons.map((balloon) => (
                    <div key={balloon.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <h3>Шар #{balloon.id}</h3>
                        <label>
                            Модель:
                            <input
                                type="text"
                                value={balloon.model}
                                onChange={(e) => handleEditChange(balloon.id, "model", e.target.value)}
                            />
                        </label>
                        <label>
                            Вместимость:
                            <input
                                type="number"
                                value={balloon.capacity}
                                onChange={(e) => handleEditChange(balloon.id, "capacity", e.target.value)}
                            />
                        </label>
                        <label>
                            Статус:
                            <select
                                value={balloon.status}
                                onChange={(e) => handleEditChange(balloon.id, "status", e.target.value)}
                            >
                                <option value="in_service">В эксплуатации</option>
                                <option value="under_repair">В ремонте</option>
                                <option value="available">Доступен</option>
                            </select>
                        </label>
                        <button onClick={() => handleSave(balloon.id)}>Сохранить</button>
                        <button onClick={() => handleDelete(balloon.id)}>Удалить</button>
                    </div>
                ))}
            </div>

            <h3>Добавить новый шар</h3>
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                <label>
                    Модель:
                    <input
                        type="text"
                        value={newBalloon.model}
                        onChange={(e) => setNewBalloon({ ...newBalloon, model: e.target.value })}
                    />
                </label>
                <label>
                    Вместимость:
                    <input
                        type="number"
                        value={newBalloon.capacity}
                        onChange={(e) => setNewBalloon({ ...newBalloon, capacity: e.target.value })}
                    />
                </label>
                <label>
                    Статус:
                    <select
                        value={newBalloon.status}
                        onChange={(e) => setNewBalloon({ ...newBalloon, status: e.target.value })}
                    >
                        <option value="in_service">В эксплуатации</option>
                        <option value="under_repair">В ремонте</option>
                        <option value="available">Доступен</option>
                    </select>
                </label>
                <button onClick={handleAdd}>Добавить</button>
            </div>
        </div>
    );
};

export default BalloonEditor;
