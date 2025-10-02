# Express.js Server Boilerplate Makefile
# Полезные команды для разработки и развертывания

# Переменные
DOCKER_IMAGE_NAME = expressjs-server-boilerplate
DOCKER_CONTAINER_NAME = expressjs-app
PORT = 3000

# Цвета для вывода
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help install build start dev clean docker-build docker-run docker-stop docker-clean logs type-check lint format test

# Помощь - показать все доступные команды
help: ## Показать это сообщение помощи
	@echo "$(BLUE)Express.js Server Boilerplate - Доступные команды:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Установка зависимостей
install: ## Установить все зависимости
	@echo "$(YELLOW)Устанавливаем зависимости...$(NC)"
	npm install

# Сборка проекта
build: ## Скомпилировать TypeScript в JavaScript
	@echo "$(YELLOW)Собираем проект...$(NC)"
	npm run build

# Запуск в продакшн режиме
start: build ## Запустить сервер в продакшн режиме
	@echo "$(GREEN)Запускаем сервер...$(NC)"
	npm start

# Разработка с автоперезагрузкой
dev: ## Запустить сервер в режиме разработки
	@echo "$(GREEN)Запускаем сервер в режиме разработки...$(NC)"
	npm run dev

# Проверка типов TypeScript
type-check: ## Проверить типы TypeScript без компиляции
	@echo "$(YELLOW)Проверяем типы...$(NC)"
	npm run type-check

# Очистка скомпилированных файлов
clean: ## Удалить скомпилированные файлы и node_modules
	@echo "$(YELLOW)Очищаем проект...$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-lock.json

# Docker команды
docker-build: ## Собрать Docker образ
	@echo "$(YELLOW)Собираем Docker образ...$(NC)"
	docker build -t $(DOCKER_IMAGE_NAME) .

docker-run: docker-build ## Запустить контейнер
	@echo "$(GREEN)Запускаем Docker контейнер...$(NC)"
	docker run -d --name $(DOCKER_CONTAINER_NAME) -p $(PORT):$(PORT) $(DOCKER_IMAGE_NAME)

docker-stop: ## Остановить Docker контейнер
	@echo "$(YELLOW)Останавливаем Docker контейнер...$(NC)"
	docker stop $(DOCKER_CONTAINER_NAME) || true
	docker rm $(DOCKER_CONTAINER_NAME) || true

docker-logs: ## Показать логи Docker контейнера
	docker logs -f $(DOCKER_CONTAINER_NAME)

docker-clean: docker-stop ## Удалить Docker образ и контейнер
	@echo "$(YELLOW)Удаляем Docker образ...$(NC)"
	docker rmi $(DOCKER_IMAGE_NAME) || true

# Docker Compose команды
docker-compose-up: ## Запустить через docker-compose
	@echo "$(YELLOW)Копируем .env.local.example в .env.local$(NC)"
	cp .env.local.example .env.local
	@echo "$(GREEN)Запускаем через docker-compose...$(NC)"
	docker-compose up --build -d

docker-compose-down: ## Остановить docker-compose
	@echo "$(YELLOW)Останавливаем docker-compose...$(NC)"
	docker-compose down

docker-compose-logs: ## Показать логи docker-compose
	docker-compose logs -f

ngrok: ## Запустить ngrok в фоне
	@echo "$(GREEN)Запускаем ngrok в фоне...$(NC)"
	ngrok http $(PORT) &

ngrok-stop: ## Остановить ngrok
	@echo "$(YELLOW)Останавливаем ngrok...$(NC)"
	pkill -f ngrok || true

# deploy commands
deploy-prod: ## Собрать и запустить на продакшн
	@echo "$(YELLOW)Deploy to production...$(NC)"
	make docker-build
	make ngrok
	make docker-run


# Разработка
setup: install ## Настроить проект для разработки
	@echo "$(GREEN)Проект настроен для разработки!$(NC)"
	@echo "$(BLUE)Для запуска в режиме разработки используйте: make dev$(NC)"

# Проверка состояния
status: ## Показать статус сервера
	@echo "$(BLUE)Статус сервера:$(NC)"
	@if curl -s http://localhost:$(PORT) > /dev/null; then \
		echo "$(GREEN)✓ Сервер запущен на http://localhost:$(PORT)$(NC)"; \
	else \
		echo "$(RED)✗ Сервер не отвечает на http://localhost:$(PORT)$(NC)"; \
	fi

# Проверка зависимостей
check-deps: ## Проверить устаревшие зависимости
	@echo "$(YELLOW)Проверяем устаревшие зависимости...$(NC)"
	npm outdated

# Обновление зависимостей
update-deps: ## Обновить зависимости
	@echo "$(YELLOW)Обновляем зависимости...$(NC)"
	npm update

# Создание backup
backup: ## Создать backup проекта
	@echo "$(YELLOW)Создаем backup...$(NC)"
	tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz --exclude=node_modules --exclude=dist --exclude=.git .

# Очистка системы
clean-all: clean docker-clean ## Полная очистка проекта
	@echo "$(RED)Выполнена полная очистка проекта$(NC)"

# По умолчанию показываем помощь
.DEFAULT_GOAL := help
