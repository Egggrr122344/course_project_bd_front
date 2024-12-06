import React, { useState, useEffect } from "react";
import { getPilots, getRoutes, getBalloons, createBooking, getCustomer } from "../api";

// eslint-disable-next-line react/prop-types
const BookingForm = ({ userId }) => {
    const [options, setOptions] = useState({
        pilots: [],
        routes: [],
        balloons: [],
    });
    const [formData, setFormData] = useState({
        pilotId: "",
        routeId: "",
        balloonId: "",
        flightDate: "",
    });
    const [customerId, setCustomerId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerAndData = async () => {
            try {
                const customer = await getCustomer(userId);
                setCustomerId(customer.id);

                const [pilots, routes, balloons] = await Promise.all([
                    getPilots(),
                    getRoutes(),
                    getBalloons(),
                ]);
                setOptions({ pilots, routes, balloons });
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                alert("Не удалось загрузить данные. Попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerAndData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { pilotId, routeId, balloonId, flightDate } = formData;

        if (!pilotId || !routeId || !balloonId || !flightDate) {
            alert("Пожалуйста, заполните все поля перед отправкой формы!");
            return;
        }

        const bookingData = {
            customerId,
            pilotId: Number(pilotId),
            routeId: Number(routeId),
            balloonId: Number(balloonId),
            flightDate,
        };

        try {
            console.log(bookingData)
            const response = await createBooking(bookingData);

            if (response.error) {
                alert(`Ошибка: ${response.error}`);
            } else if (response.message) {
                alert(response.message);
            } else {
                alert("Неизвестный ответ сервера. Проверьте данные.");
            }
        } catch (error) {
            console.error("Ошибка при создании бронирования:", error.message);
            alert("Произошла ошибка при создании бронирования. Попробуйте позже.");
        }
    };

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="pilotId">Выберите пилота:</label>
                <select
                    id="pilotId"
                    name="pilotId"
                    value={formData.pilotId}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        -- Выберите пилота --
                    </option>
                    {options.pilots.map((pilot) => (
                        <option key={pilot.id} value={pilot.id}>
                            {pilot.fullName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="routeId">Выберите маршрут:</label>
                <select
                    id="routeId"
                    name="routeId"
                    value={formData.routeId}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        -- Выберите маршрут --
                    </option>
                    {options.routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.startLocation} - {route.endLocation}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="balloonId">Выберите шар:</label>
                <select
                    id="balloonId"
                    name="balloonId"
                    value={formData.balloonId}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        -- Выберите шар --
                    </option>
                    {options.balloons.map((balloon) => (
                        <option key={balloon.id} value={balloon.id}>
                            {balloon.model} (вместимость: {balloon.capacity})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="flightDate">Дата полета:</label>
                <input
                    type="date"
                    id="flightDate"
                    name="flightDate"
                    value={formData.flightDate}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" disabled={loading}>
                Забронировать
            </button>
        </form>
    );
};

export default BookingForm;
