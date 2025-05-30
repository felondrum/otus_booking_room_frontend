import React, { useEffect, useState } from 'react';
import { Booking, Room } from '../types/api';
import { bookingApi, roomApi } from '../services/api';
import { useUser } from '../context/UserContext';
import { Alert, Snackbar } from '@mui/material';

export const UserBookings: React.FC = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Record<string, Room>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomApi.getAll();
        const roomsMap = response.data.reduce((acc, room) => {
          acc[room.id] = room;
          return acc;
        }, {} as Record<string, Room>);
        setRooms(roomsMap);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setBookings([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await bookingApi.getByUserId(user.id);
        setBookings(response.data);
      } catch (err) {
        setError('Ошибка при загрузке бронирований');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingApi.delete(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      setSuccessMessage('Бронирование успешно отменено');
    } catch (err) {
      setError('Ошибка при отмене бронирования');
      console.error('Error canceling booking:', err);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Мои бронирования</h2>
        <p className="text-yellow-700">
          Пожалуйста, выберите пользователя, чтобы просмотреть его бронирования
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Мои бронирования</h2>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">Мои бронирования</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Мои бронирования</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">У вас пока нет бронирований</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const room = rooms[booking.roomId];
            return (
              <div
                key={booking.id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-lg">
                      {room ? room.name : 'Загрузка информации о комнате...'}
                    </p>
                    {room && (
                      <>
                        <p className="text-sm text-gray-600">
                          Вместимость: {room.capacity} человек
                        </p>
                        {room.description && (
                          <p className="text-sm text-gray-600">
                            {room.description}
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Начало: {new Date(booking.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Конец: {new Date(booking.endTime).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}; 