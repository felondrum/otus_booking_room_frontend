import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { Room } from '../types/api';
import { bookingApi } from '../services/api';

interface BookingFormProps {
  room: Room;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  room,
  open,
  onClose,
  onSuccess,
  userId,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingApi.create({
        roomId: room.id,
        userId,
        startTime,
        endTime,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Ошибка при создании бронирования');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Бронирование комнаты "{room.name}"</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Время начала"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Время окончания"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            {error && (
              <Box sx={{ color: 'error.main', mt: 1 }}>
                {error}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" color="primary">
            Забронировать
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 