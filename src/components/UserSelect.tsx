import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import { User } from '../types/api';
import { useUser } from '../context/UserContext';
import { Box, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';

export const UserSelect: React.FC = () => {
  const { user, setUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (e) {
      setError('Ошибка загрузки пользователей');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await userApi.create({ name, email });
      setUsers((prev) => [...prev, res.data]);
      setUser(res.data);
      setOpen(false);
      setName('');
      setEmail('');
      setError(null);
    } catch (e) {
      setError('Ошибка создания пользователя');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        value={user?.id || ''}
        displayEmpty
        onChange={e => {
          const selected = users.find(u => u.id === e.target.value);
          setUser(selected || null);
        }}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value=""><em>Выберите пользователя</em></MenuItem>
        {users.map(u => (
          <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
        ))}
      </Select>
      <Button variant="outlined" onClick={() => setOpen(true)}>Создать пользователя</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Создать пользователя</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Имя" value={name} onChange={e => setName(e.target.value)} fullWidth required />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required />
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