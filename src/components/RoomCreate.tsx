import React, { useState } from 'react';
import { roomApi } from '../services/api';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';

interface RoomCreateProps {
  onCreated?: () => void;
}

export const RoomCreate: React.FC<RoomCreateProps> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      await roomApi.create({ name, capacity: Number(capacity), description });
      setOpen(false);
      setName('');
      setCapacity('');
      setDescription('');
      setError(null);
      onCreated && onCreated();
    } catch (e) {
      setError('Ошибка создания комнаты');
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ ml: 2 }}>
        Создать комнату
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Создать комнату</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={name} onChange={e => setName(e.target.value)} fullWidth required />
          <TextField label="Вместимость" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} fullWidth required />
          <TextField label="Описание" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleCreate} variant="contained">Создать</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 