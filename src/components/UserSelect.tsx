import React, { useEffect, useState } from 'react';
import { userApi } from '../services/api';
import { User } from '../types/api';
import { useUser } from '../context/UserContext';
import { Box, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Tooltip, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const UserSelect: React.FC = () => {
  const { user, setUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      setSuccessMessage('Пользователь успешно создан');
    } catch (e) {
      setError('Ошибка создания пользователя');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      flexDirection: isMobile ? 'column' : 'row',
      width: isMobile ? '100%' : 'auto'
    }}>
      <Select
        value={user?.id || ''}
        displayEmpty
        onChange={e => {
          const selected = users.find(u => u.id === e.target.value);
          setUser(selected || null);
        }}
        sx={{ 
          minWidth: isMobile ? '100%' : 200,
          backgroundColor: 'white',
          borderRadius: 1
        }}
      >
        <MenuItem value=""><em>Выберите пользователя</em></MenuItem>
        {users.map(u => (
          <MenuItem key={u.id} value={u.id}>{u.name} ({u.email})</MenuItem>
        ))}
      </Select>
      <Tooltip title="Создать пользователя">
        <IconButton 
          onClick={() => setOpen(true)}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <PersonAddIcon />
        </IconButton>
      </Tooltip>
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            zIndex: 1300
          }
        }}
      >
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
    </Box>
  );
}; 