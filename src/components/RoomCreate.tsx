import React, { useState } from 'react';
import { roomApi } from '../services/api';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Typography,
  Alert,
  Snackbar
} from '@mui/material';

interface RoomCreateProps {
  onCreated?: () => void;
}

export const RoomCreate: React.FC<RoomCreateProps> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      await roomApi.create({ name, capacity: Number(capacity), description });
      setSuccessMessage('Комната успешно создана');
      // Закрываем диалог через 1.5 секунды после успешного создания
      setTimeout(() => {
        setOpen(false);
        setName('');
        setCapacity('');
        setDescription('');
        setError(null);
        onCreated && onCreated();
      }, 1500);
    } catch (e) {
      setError('Ошибка создания комнаты');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setCapacity('');
    setDescription('');
    setError(null);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ ml: 2 }}>
        Создать комнату
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создать комнату</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField 
            label="Название" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            fullWidth 
            required 
          />
          <TextField 
            label="Вместимость" 
            type="number" 
            value={capacity} 
            onChange={e => setCapacity(e.target.value)} 
            fullWidth 
            required 
            inputProps={{ min: 1 }}
          />
          <TextField 
            label="Описание" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            fullWidth 
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained"
            disabled={!name || !capacity}
          >
            Создать
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
}; 