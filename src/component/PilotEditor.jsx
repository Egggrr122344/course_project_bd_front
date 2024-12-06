import { useState, useEffect } from "react";

const PilotEditor = () => {
    const [pilots, setPilots] = useState([]);
    const [newPilot, setNewPilot] = useState({ fullName: "", licenseNumber: "" });
    const url = "http://localhost:8080/api/pilots";

    useEffect(() => {
        fetch(url)
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка загрузки пилотов");
                return response.json();
            })
            .then((data) => setPilots(data))
            .catch((error) => console.error(error));
    }, []);

    const handleEditChange = (id, field, value) => {
        setPilots((prevPilots) =>
            prevPilots.map((pilot) =>
                pilot.id === id ? { ...pilot, [field]: value } : pilot
            )
        );
    };

    const handleSave = (id) => {
        const updatedPilot = pilots.find((pilot) => pilot.id === id);
        fetch(`${url}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedPilot),
        })
            .then(() => alert("Пилот успешно обновлен!"))
            .catch((error) => console.error(error));
    };

    const handleDelete = (id) => {
        fetch(`${url}/${id}`, { method: "DELETE" })
            .then(() => setPilots((prevPilots) => prevPilots.filter((p) => p.id !== id)))
            .catch((error) => console.error(error));
    };

    const handleAdd = () => {
        if (newPilot.fullName && newPilot.licenseNumber) {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPilot),
            })
                .then((response) => response.json())
                .then((data) => {
                    setPilots((prevPilots) => [...prevPilots, data]);
                    setNewPilot({ fullName: "", licenseNumber: "" });
                })
                .catch((error) => console.error(error));
        } else {
            alert("Заполните все поля!");
        }
    };

    return (
        <div>
            <h2>Редактирование пилотов</h2>
            <div>
                {pilots.map((pilot) => (
                    <div key={pilot.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                        <h3>Пилот #{pilot.id}</h3>
                        <label>
                            Полное имя:
                            <input
                                type="text"
                                value={pilot.fullName}
                                onChange={(e) => handleEditChange(pilot.id, "fullName", e.target.value)}
                            />
                        </label>
                        <label>
                            Номер лицензии:
                            <input
                                type="text"
                                value={pilot.licenseNumber}
                                onChange={(e) => handleEditChange(pilot.id, "licenseNumber", e.target.value)}
                            />
                        </label>
                        <button onClick={() => handleSave(pilot.id)}>Сохранить</button>
                        <button onClick={() => handleDelete(pilot.id)}>Удалить</button>
                    </div>
                ))}
            </div>

            <h3>Добавить нового пилота</h3>
            <div style={{ border: "1px solid #ccc", padding: "10px" }}>
                <label>
                    Полное имя:
                    <input
                        type="text"
                        value={newPilot.fullName}
                        onChange={(e) => setNewPilot({ ...newPilot, fullName: e.target.value })}
                    />
                </label>
                <label>
                    Номер лицензии:
                    <input
                        type="text"
                        value={newPilot.licenseNumber}
                        onChange={(e) => setNewPilot({ ...newPilot, licenseNumber: e.target.value })}
                    />
                </label>
                <button onClick={handleAdd}>Добавить</button>
            </div>
        </div>
    );
};

export default PilotEditor;
