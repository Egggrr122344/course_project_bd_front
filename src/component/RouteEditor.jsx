import { useState, useEffect } from "react";

const RouteEditor = () => {
    const [routes, setRoutes] = useState([]);
    const [newRoute, setNewRoute] = useState({ startLocation: "", endLocation: "" });
    const url = "http://localhost:8080/api/routes";

    useEffect(() => {
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка загрузки маршрутов");
                return response.json();
            })
            .then((data) => setRoutes(data))
            .catch((error) => console.error(error));
    }, []);

    const handleEditChange = (id, field, value) => {
        setRoutes((prevRoutes) =>
            prevRoutes.map((route) =>
                route.id === id ? { ...route, [field]: value } : route
            )
        );
    };

    const handleSave = (id) => {
        const updatedRoute = routes.find((route) => route.id === id);
        fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRoute),
        })
            .then(() => alert("Маршрут успешно обновлен!"))
            .catch((error) => console.error(error));
    };

    const handleDelete = (id) => {
        fetch(`${url}/${id}`, { method: "DELETE" })
            .then(() => setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== id)))
            .catch((error) => console.error(error));
    };

    const handleAdd = () => {
        if (newRoute.startLocation && newRoute.endLocation) {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRoute),
            })
                .then((response) => response.json())
                .then((data) => {
                    setRoutes((prevRoutes) => [...prevRoutes, data]);
                    setNewRoute({ startLocation: "", endLocation: "" });
                })
                .catch((error) => console.error(error));
        } else {
            alert("Заполните все поля!");
        }
    };

    return (
        <div>
            <h2>Редактирование маршрутов</h2>
            <div>
                {routes.map((route) => (
                    <div key={route.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <h3>Маршрут #{route.id}</h3>
                        <label>
                            Начало маршрута:
                            <input
                                type="text"
                                value={route.startLocation}
                                onChange={(e) => handleEditChange(route.id, "startLocation", e.target.value)}
                            />
                        </label>
                        <label>
                            Конец маршрута:
                            <input
                                type="text"
                                value={route.endLocation}
                                onChange={(e) => handleEditChange(route.id, "endLocation", e.target.value)}
                            />
                        </label>
                        <button onClick={() => handleSave(route.id)}>Сохранить</button>
                        <button onClick={() => handleDelete(route.id)}>Удалить</button>
                    </div>
                ))}
            </div>

            <h3>Добавить новый маршрут</h3>
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                <label>
                    Начало маршрута:
                    <input
                        type="text"
                        value={newRoute.startLocation}
                        onChange={(e) => setNewRoute({ ...newRoute, startLocation: e.target.value })}
                    />
                </label>
                <label>
                    Конец маршрута:
                    <input
                        type="text"
                        value={newRoute.endLocation}
                        onChange={(e) => setNewRoute({ ...newRoute, endLocation: e.target.value })}
                    />
                </label>
                <button onClick={handleAdd}>Добавить</button>
            </div>
        </div>
    );
};

export default RouteEditor;
