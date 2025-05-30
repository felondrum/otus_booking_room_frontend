import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Система бронирования переговорных комнат
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/"
                >
                  Комнаты
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/bookings"
                >
                  Мои бронирования
                </Button>
                <UserSelect />
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<RoomList />} />
              <Route path="/bookings" element={
                <Typography variant="h5" align="center" sx={{ mt: 4 }}>
                  Страница моих бронирований (в разработке)
                </Typography>
              } />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
