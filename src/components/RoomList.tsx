import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box
} from '@mui/material';
import { Room } from '../types/api';
import { roomApi } from '../services/api';
import { format } from 'date-fns';
import { BookingForm } from './BookingForm';
import { RoomFilters } from './RoomFilters';
import { RoomCreate } from './RoomCreate';
import { useUser } from '../context/UserContext';

export const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'date' | 'datetime'>('date');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState<number | ''>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { user } = useUser();

  const loadRooms = async () => {
    try {
      setLoading(true);
      let response;
      if (filterMode === 'date') {
        response = await roomApi.getAvailableByDate({ date, capacity: capacity || undefined });
      } else {
        response = await roomApi.getAvailable({ startTime, endTime, capacity: capacity || undefined });
      }
      setRooms(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке комнат');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line
  }, [date, startTime, endTime, capacity, filterMode]);

  const handleBookingSuccess = () => {
    loadRooms();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <RoomFilters
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          capacity={capacity}
          setCapacity={setCapacity}
        />
        <RoomCreate onCreated={loadRooms} />
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {rooms.map((room) => (
          <Box key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {room.name}
                </Typography>
                <Typography color="text.secondary">
                  Вместимость: {room.capacity} человек
                </Typography>
                {room.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {room.description}
                  </Typography>
                )}
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => setSelectedRoom(room)}
                  disabled={!user}
                >
                  Забронировать
                </Button>
                {!user && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    Сначала выберите пользователя
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {selectedRoom && user && (
        <BookingForm
          room={selectedRoom}
          open={true}
          onClose={() => setSelectedRoom(null)}
          onSuccess={handleBookingSuccess}
          userId={user.id}
        />
      )}
    </Box>
  );
}; 