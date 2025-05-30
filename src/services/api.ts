import axios from 'axios';
import { 
  User, 
  Room, 
  Booking, 
  CreateUserRequest, 
  CreateRoomRequest, 
  CreateBookingRequest,
  AvailableRoomsRequest,
  AvailableRoomsByDateRequest
} from '../types/api';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getAll: () => api.get<User[]>('/users'),
  create: (data: CreateUserRequest) => api.post<User>('/users', data),
};

export const roomApi = {
  getAll: () => api.get<Room[]>('/rooms'),
  create: (data: CreateRoomRequest) => api.post<Room>('/rooms', data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  getAvailable: (data: AvailableRoomsRequest) => api.post<Room[]>('/rooms/available', data),
  getAvailableByDate: (data: AvailableRoomsByDateRequest) => api.post<Room[]>('/rooms/available/date', data),
};

export const bookingApi = {
  getAll: () => api.get<Booking[]>('/bookings'),
  create: (data: CreateBookingRequest) => api.post<Booking>('/bookings', data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
  checkAvailability: (data: { roomId: string; startTime: string; endTime: string }) => 
    api.get<boolean>('/bookings/check', { params: data }),
};

export {}; 