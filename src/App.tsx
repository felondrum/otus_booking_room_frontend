import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  CssBaseline, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { RoomList } from './components/RoomList';
import { UserProvider } from './context/UserContext';
import { UserSelect } from './components/UserSelect';
import { UserBookings } from './components/UserBookings';
import { RoomCreate } from './components/RoomCreate';
import { BookingForm } from './components/BookingForm';
import { useUser } from './context/UserContext';
import { Room } from './types/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    setSelectedRoom(null);
  };

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              Система бронирования переговорных комнат
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              OTUS. Scala разработчик. Филиппов Антон
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <UserSelect />
            <Button 
              color="inherit" 
              onClick={() => handleTabChange('/')}
              sx={{ 
                backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' 
              }}
            >
              Комнаты
            </Button>
            <Button 
              color="inherit" 
              onClick={() => handleTabChange('/bookings')}
              sx={{ 
                backgroundColor: location.pathname === '/bookings' ? 'rgba(255, 255, 255, 0.1)' : 'transparent' 
              }}
            >
              Бронирования
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={
              <>
                <RoomCreate />
                <RoomList onRoomSelect={setSelectedRoom} onBookingClick={() => setIsBookingFormOpen(true)} />
              </>
            } />
            <Route path="/bookings" element={
              <>
                {selectedRoom && (
                  <BookingForm 
                    room={selectedRoom}
                    open={isBookingFormOpen}
                    onClose={() => setIsBookingFormOpen(false)}
                    onSuccess={handleBookingSuccess}
                    userId={user?.id || ''}
                  />
                )}
                <UserBookings />
              </>
            } />
          </Routes>
        </Box>
      </Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
