import React, { useState, useEffect } from 'react';
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
  // Функция для получения текущей даты в формате YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('sv-SE'); // формат YYYY-MM-DD
  };

  // Функция для получения текущего времени в формате YYYY-MM-DDThh:mm
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(' ', 'T');
  };

  // Функция для получения времени через час в формате YYYY-MM-DDThh:mm
  const getDateTimePlusHour = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(' ', 'T');
  };

  // Функция для получения времени через час от указанного времени
  const getEndTimeFromStart = (startTimeStr: string) => {
    const startDate = new Date(startTimeStr);
    startDate.setHours(startDate.getHours() + 1);
    return startDate.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(' ', 'T');
  };

  // Инициализация времени при монтировании компонента
  useEffect(() => {
    if (filterMode === 'date') {
      setDate(getCurrentDate());
    } else {
      setStartTime(getCurrentDateTime());
      setEndTime(getDateTimePlusHour());
    }
  }, []);

  // Обновление времени при изменении режима фильтрации
  useEffect(() => {
    if (filterMode === 'date') {
      setDate(getCurrentDate());
    } else {
      setStartTime(getCurrentDateTime());
      setEndTime(getDateTimePlusHour());
    }
  }, [filterMode]);

  // Обработчик изменения времени начала
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (newStartTime) {
      setEndTime(getEndTimeFromStart(newStartTime));
    }
  };

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
          inputProps={{
            min: getCurrentDate()
          }}
        />
      ) : (
        <>
          <TextField
            type="datetime-local"
            label="Начало"
            value={startTime}
            onChange={handleStartTimeChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: getCurrentDateTime()
            }}
          />
          <TextField
            type="datetime-local"
            label="Окончание"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: startTime || getCurrentDateTime()
            }}
          />
        </>
      )}
      <TextField
        type="number"
        label="Вместимость"
        value={capacity}
        onChange={e => setCapacity(e.target.value ? Number(e.target.value) : '')}
        InputLabelProps={{ shrink: true }}
        inputProps={{
          min: 1
        }}
      />
    </Box>
  );
}; 