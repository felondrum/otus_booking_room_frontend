import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Link
            href="https://github.com/felondrum/otus_booking_room_frontend/tree/develop"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <GitHubIcon />
            <Typography variant="body2">Frontend</Typography>
          </Link>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            |
          </Typography>
          <Link
            href="https://github.com/felondrum/otus_booking_room_service/tree/develop"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <GitHubIcon />
            <Typography variant="body2">Backend</Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}; 