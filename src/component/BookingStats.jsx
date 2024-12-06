// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { getCustomerBookings } from "../api";

const BookingStats = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingData = await getCustomerBookings();
                setBookings(bookingData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBookings();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Статистика бронирований</h2>
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.customer_id}>
                      Пользователь: {booking.full_name}   имеет {booking.total_bookings} бронирований
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingStats;
