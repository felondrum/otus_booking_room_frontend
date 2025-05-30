#!/bin/bash

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js не установлен. Устанавливаем..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v)
echo "Установлена версия Node.js: $NODE_VERSION"

# Проверяем наличие npm
if ! command -v npm &> /dev/null; then
    echo "npm не установлен. Устанавливаем..."
    sudo apt-get install -y npm
fi

# Устанавливаем зависимости
echo "Устанавливаем зависимости..."
npm install

# Устанавливаем переменную окружения для API URL
export REACT_APP_API_URL="http://176.108.251.54/api"
echo "Установлен API URL: $REACT_APP_API_URL"

# Собираем приложение
echo "Собираем приложение..."
npm run build

# Проверяем наличие serve
if ! command -v serve &> /dev/null; then
    echo "Устанавливаем serve глобально..."
    sudo npm install -g serve
fi

# Запускаем приложение
echo "Запускаем приложение на порту 3000..."
serve -s build -l 3000 