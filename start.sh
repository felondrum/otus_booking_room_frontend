#!/bin/bash

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "Docker не установлен. Пожалуйста, установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose не установлен. Пожалуйста, установите Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Проверяем версии
echo "Версия Docker: $(docker --version)"
echo "Версия Docker Compose: $(docker-compose --version)"

# Останавливаем только контейнеры фронтенда
echo "Останавливаем контейнеры фронтенда..."
docker-compose down --remove-orphans

# Собираем и запускаем контейнеры фронтенда
echo "Запускаем фронтенд..."
docker-compose up --build -d

# Проверяем статус только фронтенда
echo "Проверяем статус контейнеров фронтенда..."
docker-compose ps

echo "Фронтенд доступен по адресу: http://localhost:3000" 