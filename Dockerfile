# Используем Node.js как базовый образ
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Устанавливаем переменную окружения для API URL
ENV REACT_APP_API_URL="https://otus-filippov-room-booking.ru/api"

# Собираем приложение
RUN npm run build

# Устанавливаем serve глобально
RUN npm install -g serve

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение
CMD ["serve", "-s", "build", "-l", "3000"] 