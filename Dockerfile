FROM node:20-alpine

# Работать не под root
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Копируем package files и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем TypeScript проект
RUN npm run build

# Переключаемся на пользователя app
USER app

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]