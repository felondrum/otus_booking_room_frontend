export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
  description?: string;
}

export interface CreateBookingRequest {
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

export interface AvailableRoomsRequest {
  startTime: string;
  endTime: string;
  capacity?: number;
}

export interface AvailableRoomsByDateRequest {
  date: string;
  capacity?: number;
}

export interface ErrorResponse {
  message: string;
} 