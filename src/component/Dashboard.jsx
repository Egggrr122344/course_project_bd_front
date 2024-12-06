import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BalloonEditor from "./BalloonEditor.jsx";
import PilotEditor from "./PilotEditor.jsx";
import RouteEditor from "./RouteEditor.jsx";
import UserList from "./UserList.jsx";
import BookingStats from "./BookingStats.jsx";
import BookFlightButton from "./BookingForm.jsx"; // Import the BookingForm
import BackupButton from "./BackupButton.jsx"; // Импортируем компонент кнопки бэкапа

const Dashboard = () => {
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showBalloonEditor, setShowBalloonEditor] = useState(false);
    const [showPilotEditor, setShowPilotEditor] = useState(false);
    const [showRouteEditor, setShowRouteEditor] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showBookingStats, setShowBookingStats] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Проверяем наличие роли и userId в localStorage при загрузке
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log(storedRole)
        const storedUserId = localStorage.getItem("userId");
        console.log(storedUserId)

        if (!storedRole || !storedUserId) {
            console.log("storedRole и storedUserId не проходит проверку идет навигация обратно на авторизацию")
            navigate("/auth"); // Если данных нет, перенаправляем на авторизацию
        } else {
            console.log("они прошли проверку и засетились")
            setRole(storedRole);
            setUserId(storedUserId);
        }
        setIsLoading(false)
    }, [navigate]);
    if(isLoading) {
        return <div>Загрузка...</div>
    }

    if (!role) {
        console.log("роль не прошла")
        return <Navigate to="/auth" />;
    }

    return (
        <div>
            <h1>Добро пожаловать на сервис бронирования полетов!</h1>
            <p>Ваша роль: {role}</p>
            <nav>
                {role === "ADMIN" && (
                    <button onClick={() => setShowUserList(!showUserList)}>
                        {showUserList ? "Закрыть список пользователей" : "Просмотр пользователей"}
                    </button>
                )}
                {role === "ADMIN" && (
                    <button onClick={() => setShowBookingStats(!showBookingStats)}>
                        {showBookingStats ? "Закрыть статистику" : "Статистика бронирований"}
                    </button>
                )}
                {role === "ADMIN" && (
                    <BackupButton />
                    )}
                {role === "EDITOR" && (
                    <button onClick={() => setShowBalloonEditor(!showBalloonEditor)}>
                        {showBalloonEditor ? "Закрыть редактор шаров" : "Редактирование шаров"}
                    </button>
                )}
                {role === "EDITOR" && (
                    <button onClick={() => setShowRouteEditor(!showRouteEditor)}>
                        {showRouteEditor ? "Закрыть редактор маршрутов" : "Редактирование маршрутов"}
                    </button>
                )}
                {role === "EDITOR" && (
                    <button onClick={() => setShowPilotEditor(!showPilotEditor)}>
                        {showPilotEditor ? "Закрыть редактор пилотов" : "Редактирование пилотов"}
                    </button>
                )}
                {role === "USER" && (
                    <button onClick={() => setShowBookingForm(!showBookingForm)}>
                        {showBookingForm ? "Закрыть форму бронирования" : "Забронировать полет"}
                    </button>
                )}
            </nav>

            {showBalloonEditor && <BalloonEditor />}
            {showPilotEditor && <PilotEditor />}
            {showRouteEditor && <RouteEditor />}
            {showUserList && <UserList />}
            {showBookingStats && <BookingStats />}
            {showBookingForm && <BookFlightButton userId={userId} />}
        </div>
    );
};

export default Dashboard;
