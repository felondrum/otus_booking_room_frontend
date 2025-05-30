import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Snackbar,
  InputAdornment,
} from '@mui/material';
import { Room } from '../types/api';
import { bookingApi } from '../services/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    
    if (newStartTime) {
      // Получаем локальное время в миллисекундах
      const localStartTime = new Date(newStartTime).getTime();
      // Добавляем 30 минут в миллисекундах
      const localEndTime = localStartTime + (30 * 60 * 1000);
      // Создаем новую дату и форматируем её в локальное время
      const endDate = new Date(localEndTime);
      const endTimeFormatted = endDate.toLocaleString('sv-SE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(' ', 'T');
      setEndTime(endTimeFormatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingApi.create({
        roomId: room.id,
        userId,
        startTime,
        endTime,
      });
      setSuccessMessage('Комната успешно забронирована');
      // Увеличим время до закрытия диалога, чтобы сообщение успело показаться
      setTimeout(() => {
        onSuccess();
        onClose();
        setStartTime('');
        setEndTime('');
        setError(null);
      }, 2000);
    } catch (err) {
      setError('Ошибка при создании бронирования');
      console.error(err);
    }
  };

  const handleClose = () => {
    onClose();
    setStartTime('');
    setEndTime('');
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Бронирование комнаты "{room.name}"</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Время начала"
                type="datetime-local"
                value={startTime}
                onChange={handleStartTimeChange}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  min: new Date().toISOString().slice(0, 16)
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: startTime ? 'inherit' : 'rgba(0, 0, 0, 0.38)'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon 
                        sx={{ 
                          cursor: 'pointer',
                          color: 'action.active',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                        onClick={() => {
                          const input = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
                          if (input) {
                            input.showPicker();
                          }
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Время окончания"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  min: startTime || new Date().toISOString().slice(0, 16)
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: endTime ? 'inherit' : 'rgba(0, 0, 0, 0.38)'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayIcon 
                        sx={{ 
                          cursor: 'pointer',
                          color: 'action.active',
                          '&:hover': {
                            color: 'primary.main'
                          }
                        }}
                        onClick={() => {
                          const inputs = document.querySelectorAll('input[type="datetime-local"]');
                          const input = inputs[1] as HTMLInputElement;
                          if (input) {
                            input.showPicker();
                          }
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Box sx={{ color: 'error.main', mt: 1 }}>
                  {error}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!startTime || !endTime}
            >
              Забронировать
            </Button>
          </DialogActions>
        </form>
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSuccessMessage(null)}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Dialog>
    </>
  );
}; 