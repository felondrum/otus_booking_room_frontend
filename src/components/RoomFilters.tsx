import React, { useState } from 'react';
import { Box, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface RoomFiltersProps {
  filterMode: 'date' | 'datetime';
  setFilterMode: (mode: 'date' | 'datetime') => void;
  date: string;
  setDate: (date: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  capacity: number | '';
  setCapacity: (val: number | '') => void;
}

export const RoomFilters: React.FC<RoomFiltersProps> = ({
  filterMode, setFilterMode, date, setDate, startTime, setStartTime, endTime, setEndTime, capacity, setCapacity
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <ToggleButtonGroup
        value={filterMode}
        exclusive
        onChange={(_, val) => val && setFilterMode(val)}
        size="small"
      >
        <ToggleButton value="date">По дате</ToggleButton>
        <ToggleButton value="datetime">По дате и времени</ToggleButton>
      </ToggleButtonGroup>
      {filterMode === 'date' ? (
        <TextField
          type="date"
          label="Дата"
          value={date}
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      ) : (
        <>
          <TextField
            type="datetime-local"
            label="Начало"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="datetime-local"
            label="Окончание"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </>
      )}
      <TextField
        type="number"
        label="Вместимость"
        value={capacity}
        onChange={e => setCapacity(e.target.value ? Number(e.target.value) : '')}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
}; 