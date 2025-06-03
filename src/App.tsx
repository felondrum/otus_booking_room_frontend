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
import { Footer } from './components/Footer';
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
  const [refreshRooms, setRefreshRooms] = useState(0);

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    setSelectedRoom(null);
    setRefreshRooms(prev => prev + 1);
  };

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            flexGrow: 1,
            overflow: 'hidden'
          }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              Система бронирования переговорных комнат
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              OTUS. Scala разработчик. Филиппов Антон
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <UserSelect />
            <Button 
              color="inherit" 
              onClick={() => handleTabChange('/')}
              sx={{ 
                backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Комнаты
            </Button>
            <Button 
              color="inherit" 
              onClick={() => handleTabChange('/bookings')}
              sx={{ 
                backgroundColor: location.pathname === '/bookings' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Бронирования
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 2, sm: 4 }, 
          mb: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 },
          flex: 1
        }}
      >
        <Box sx={{ mt: { xs: 2, sm: 4 } }}>
          <Routes>
            <Route path="/" element={
              <>
                <RoomCreate />
                <RoomList 
                  onRoomSelect={setSelectedRoom} 
                  onBookingClick={() => setIsBookingFormOpen(true)} 
                  refreshTrigger={refreshRooms}
                />
                {selectedRoom && (
                  <BookingForm 
                    room={selectedRoom}
                    open={isBookingFormOpen}
                    onClose={() => setIsBookingFormOpen(false)}
                    onSuccess={handleBookingSuccess}
                    userId={user?.id || ''}
                  />
                )}
              </>
            } />
            <Route path="/bookings" element={
              <>
                <UserBookings />
              </>
            } />
          </Routes>
        </Box>
      </Container>
      <Footer />
    </Box>
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
